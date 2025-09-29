// Utility to find chapter context in curriculum tree
export function findChapterContext(curriculum: any, chapterSlug: string) {
  // Handle curriculum structure: curriculum -> courses -> weeks -> days -> lessons -> chapters
  if (curriculum.courses) {
    for (const course of curriculum.courses) {
      if (course.weeks) {
        for (const week of course.weeks) {
          for (const day of week.days) {
            for (const lesson of day.lessons) {
              for (const chapter of lesson.chapters) {
                if (chapter.slug === chapterSlug) {
                  return {
                    chapter,
                    lesson,
                    day,
                    week,
                    course,
                    path: [curriculum.title, course.title, week.title, day.title, lesson.title, chapter.slug],
                  };
                }
              }
            }
          }
        }
      }
    }
  }
  
  // Fallback: Handle direct weeks structure (legacy)
  if (curriculum.weeks) {
    for (const week of curriculum.weeks) {
      for (const day of week.days) {
        for (const lesson of day.lessons) {
          for (const chapter of lesson.chapters) {
            if (chapter.slug === chapterSlug) {
              return {
                chapter,
                lesson,
                day,
                week,
                path: [curriculum.title, week.title, day.title, lesson.title, chapter.slug],
              };
            }
          }
        }
      }
    }
  }
  
  return null;
}

// Returns an array of titles/slugs for the path to the chapter
export function getChapterPath(curriculum: any, chapterSlug: string) {
  const context = findChapterContext(curriculum, chapterSlug);
  if (!context) return [];
  
  if (context.course) {
    return [context.course.title, context.week.title, context.day.title, context.lesson.title, context.chapter.slug];
  } else {
    return [context.week.title, context.day.title, context.lesson.title, context.chapter.slug];
  }
} 