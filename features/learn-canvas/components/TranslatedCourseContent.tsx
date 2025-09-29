import React from 'react';
import { useLanguage } from '../../../shared/i18n/LanguageProvider';

interface TranslatedCourseContentProps {
  workshopSlug: string;
  chapterSlug: string;
  className?: string;
}

export const TranslatedCourseContent: React.FC<TranslatedCourseContentProps> = ({
  workshopSlug,
  chapterSlug,
  className = ''
}) => {
  const { t, language } = useLanguage();

  // Check if this is an AI ethics course
  const ethicsCourses = ['ai-ethics-governance', 'ai-social-impact', 'ethical-ai-journalism', 'ai-literacy-digital-citizenship'];
  const isEthicsCourse = ethicsCourses.includes(workshopSlug);

  if (!isEthicsCourse) {
    return null; // Only render for AI ethics courses
  }

  const courseKey = workshopSlug.replace(/-/g, '_');

  // Get translated content
  const chapterTitle = t(`courses.${courseKey}.chapters.${chapterSlug}.title`);
  const hook = t(`courses.${courseKey}.chapters.${chapterSlug}.content.hook`);
  const overview = t(`courses.${courseKey}.chapters.${chapterSlug}.content.overview`);
  
  // Get concepts
  const conceptsTitle = t(`courses.${courseKey}.chapters.${chapterSlug}.content.concepts.title`);
  const conceptsItems = t(`courses.${courseKey}.chapters.${chapterSlug}.content.concepts.items`, { returnObjects: true });
  
  // Get hands-on activity
  const handsOnTitle = t(`courses.${courseKey}.chapters.${chapterSlug}.content.hands_on.title`);
  const handsOnDescription = t(`courses.${courseKey}.chapters.${chapterSlug}.content.hands_on.description`);
  
  // Get reflection
  const reflectionTitle = t(`courses.${courseKey}.chapters.${chapterSlug}.content.reflection.title`);
  const reflectionQuestions = t(`courses.${courseKey}.chapters.${chapterSlug}.content.reflection.questions`, { returnObjects: true });

  // Check if we have Spanish translations
  const hasSpanishContent = language === 'es' && chapterTitle && chapterTitle !== `courses.${courseKey}.chapters.${chapterSlug}.title`;

  if (!hasSpanishContent) {
    return (
      <div className={`translated-course-content ${className}`}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-semibold">Translation Not Available</h3>
          <p className="text-yellow-700">
            This chapter is not yet available in Spanish. Please switch to English or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`translated-course-content ${className}`}>
      {/* Chapter Title */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {chapterTitle}
        </h1>
      </header>

      {/* Hook Section */}
      {hook && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium mr-3">
              {t('course_content.hook', { fallback: 'Hook' })}
            </span>
          </h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {hook}
            </p>
          </div>
        </section>
      )}

      {/* Overview Section */}
      {overview && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-medium mr-3">
              {t('course_content.overview', { fallback: 'Overview' })}
            </span>
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {overview}
            </p>
          </div>
        </section>
      )}

      {/* Concepts Section */}
      {conceptsTitle && Array.isArray(conceptsItems) && conceptsItems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm font-medium mr-3">
              {conceptsTitle}
            </span>
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <ul className="space-y-3">
              {conceptsItems.map((item: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Hands-on Activity Section */}
      {handsOnTitle && handsOnDescription && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-sm font-medium mr-3">
              {handsOnTitle}
            </span>
          </h2>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {handsOnDescription}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Reflection Section */}
      {reflectionTitle && Array.isArray(reflectionQuestions) && reflectionQuestions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-sm font-medium mr-3">
              {reflectionTitle}
            </span>
          </h2>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
            <div className="space-y-4">
              {reflectionQuestions.map((question: string, index: number) => (
                <div key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    ?
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default TranslatedCourseContent;
