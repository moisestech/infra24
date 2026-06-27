#!/usr/bin/env node
/**
 * Build Saturday Lab static assets: starter zip + QR code PNG.
 * Run: npm run saturday-lab:assets
 *
 * Set NEXT_PUBLIC_SITE_URL for production QR target (e.g. https://oolitearts.org).
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const publicDir = path.join(root, 'public/workshops')
const templateDir = path.join(root, 'content/workshops/saturday-lab/starter-template')
const zipPath = path.join(publicDir, 'saturday-lab-starter.zip')
const qrPath = path.join(publicDir, 'saturday-lab-qr.png')

const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || 'https://oolitearts.org').replace(/\/$/, '')
const hubUrl = `${siteBase}/workshop/saturday-lab`

fs.mkdirSync(publicDir, { recursive: true })

execSync(`zip -j "${zipPath}" "${path.join(templateDir, 'index.html')}" "${path.join(templateDir, 'style.css')}"`, {
  stdio: 'inherit',
})

await QRCode.toFile(qrPath, hubUrl, { width: 512, margin: 2 })

console.log(`Created ${zipPath}`)
console.log(`Created ${qrPath} → ${hubUrl}`)
