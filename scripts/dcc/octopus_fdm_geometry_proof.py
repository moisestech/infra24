"""Generic original DCC octopus geometry proof. Not a Carol/Meshy source export.
Run: pip install numpy shapely scikit-image trimesh; python scripts/dcc/octopus_fdm_geometry_proof.py
Produces one flat-bed STL; operator slicer review still required. All dimensions mm.
"""
from pathlib import Path
import numpy as np
from shapely import contains_xy
from shapely.geometry import Point, LineString
from shapely.ops import unary_union
from shapely.affinity import scale
from skimage.measure import marching_cubes
import trimesh

OUT = Path.cwd()
VOXEL = 0.36
BASE_Z = 2.88
EYE_Z = 3.96


def bezier(p0, p1, p2, p3):
    points = []
    for t in np.linspace(0, 1, 20):
        p = ((1-t)**3*np.array(p0) + 3*(1-t)**2*t*np.array(p1)
             + 3*(1-t)*t*t*np.array(p2) + t**3*np.array(p3))
        points.append(tuple(p.tolist()))
    return points


def silhouette():
    head = scale(Point(0, 12).buffer(1, resolution=40), xfact=12, yfact=13)
    ends = [(-27,-20),(-21,-29),(-14,-28),(-5,-31),
            (5,-31),(14,-28),(21,-29),(27,-20)]
    arms = []
    for i, (ex,ey) in enumerate(ends):
        sx = -8.5 + i*17/7
        controls = ((sx,3), (sx+(-4 if i<4 else 4),-5),
                    (ex+(4 if i%2 else -3),ey+8), (ex,ey))
        arms.append(LineString(bezier(*controls)).buffer(
            1.75, cap_style='round', join_style='round', resolution=8))
    shape = unary_union([head, Point(0,26.4).buffer(4.8,resolution=40), *arms])
    return shape.difference(Point(0,28).buffer(2.1,resolution=40))


def main():
    shape = silhouette()
    minx,miny,maxx,maxy = shape.bounds
    x = np.arange(minx-2, maxx+2, VOXEL)
    y = np.arange(miny-2, maxy+2, VOXEL)
    z = np.arange(-VOXEL, EYE_Z+3*VOXEL, VOXEL)
    xx,yy = np.meshgrid(x, y, indexing='ij')
    footprint = contains_xy(shape, xx, yy)
    eyes = (((xx+4.5)**2+(yy-14.5)**2)<=1.9**2) | (
        ((xx-4.5)**2+(yy-14.5)**2)<=1.9**2)
    voxels = np.zeros((len(x), len(y), len(z)), dtype=bool)
    for k, zk in enumerate(z):
        if 0 <= zk <= BASE_Z:
            voxels[:,:,k] = footprint
        elif BASE_Z < zk <= EYE_Z:
            voxels[:,:,k] = footprint & eyes
    vertices, faces, _, _ = marching_cubes(
        np.pad(voxels,1), level=0.5, spacing=(VOXEL,VOXEL,VOXEL))
    vertices += np.array([x[0]-VOXEL, y[0]-VOXEL, z[0]-VOXEL])
    vertices[:,2] -= vertices[:,2].min()
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces, process=True)
    if mesh.volume < 0:
        mesh.invert()
    assert mesh.is_watertight and mesh.is_winding_consistent
    assert mesh.volume > 0 and len(mesh.split()) == 1
    path = OUT / 'dcc_octopus_fdm_geometry_proof_v01.stl'
    mesh.export(path)
    print('STL:',path)
    print('bounds mm:', mesh.extents, 'volume mm3:', mesh.volume)
    print('watertight:',mesh.is_watertight,'triangles:',len(mesh.faces))
    print('NOTE: generic test only, NOT Carol source; slice and approve before print.')


if __name__ == '__main__':
    main()
