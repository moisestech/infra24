-- =====================================================
-- Survey Templates and Questions Queries
-- =====================================================
-- Purpose: Queries for survey system templates and questions
-- Related Docs: docs/SURVEY_SYSTEM_COMPLETE_SUMMARY.md
-- Related Docs: docs/SURVEY_TECHNICAL_IMPLEMENTATION.md
-- =====================================================

-- =====================================================
-- SURVEY TEMPLATES
-- =====================================================

-- All Survey Templates
-- Use Case: Get available survey templates for creating new surveys
SELECT 
    st.id,
    st.name,
    st.description,
    st.category,
    st.template_schema,
    st.is_public,
    st.created_at
FROM survey_templates st
ORDER BY st.name;

-- Survey Template with Question Count
-- Use Case: Display template complexity
SELECT 
    st.id,
    st.name,
    st.description,
    st.category,
    (
        SELECT COUNT(*)
        FROM jsonb_array_elements(st.template_schema->'sections') AS section
        CROSS JOIN jsonb_array_elements(section->'questions') AS question
    ) as total_questions,
    (
        SELECT COUNT(*)
        FROM jsonb_array_elements(st.template_schema->'sections') AS section
    ) as total_sections
FROM survey_templates st
ORDER BY total_questions DESC;

-- =====================================================
-- SURVEY INSTANCES
-- =====================================================

-- Surveys with Template Information
-- Use Case: Get surveys with their template details
SELECT 
    s.id,
    s.title,
    s.description,
    s.status,
    s.is_anonymous,
    s.opens_at,
    s.closes_at,
    s.template_id,
    st.name as template_name,
    st.category as template_category,
    o.name as organization_name,
    s.created_at
FROM surveys s
LEFT JOIN survey_templates st ON s.template_id = st.id
LEFT JOIN organizations o ON s.organization_id = o.id
WHERE s.status = 'active'
ORDER BY s.created_at DESC;

-- Survey Question Count (from templates)
-- Use Case: Display survey complexity to users
SELECT 
    s.id,
    s.title,
    s.organization_id,
    o.name as organization_name,
    st.name as template_name,
    (
        SELECT COUNT(*)
        FROM jsonb_array_elements(st.template_schema->'sections') AS section
        CROSS JOIN jsonb_array_elements(section->'questions') AS question
    ) as total_questions,
    (
        SELECT COUNT(*)
        FROM jsonb_array_elements(st.template_schema->'sections') AS section
    ) as total_sections
FROM surveys s
LEFT JOIN survey_templates st ON s.template_id = st.id
LEFT JOIN organizations o ON s.organization_id = o.id
WHERE s.status = 'active'
ORDER BY total_questions DESC;

-- =====================================================
-- SURVEY RESPONSES
-- =====================================================

-- Survey Response Statistics
-- Use Case: Analytics and reporting
SELECT 
    s.id,
    s.title,
    o.name as organization_name,
    COUNT(sr.id) as total_responses,
    COUNT(CASE WHEN sr.status = 'completed' THEN 1 END) as completed_responses,
    COUNT(CASE WHEN sr.status = 'in_progress' THEN 1 END) as in_progress_responses,
    ROUND(
        COUNT(CASE WHEN sr.status = 'completed' THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(sr.id), 0) * 100, 2
    ) as completion_rate_percent
FROM surveys s
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
LEFT JOIN organizations o ON s.organization_id = o.id
WHERE s.status = 'active'
GROUP BY s.id, s.title, o.name
ORDER BY total_responses DESC;

-- Recent Survey Responses
-- Use Case: Monitor survey activity
SELECT 
    sr.id,
    sr.survey_id,
    s.title as survey_title,
    o.name as organization_name,
    sr.status,
    sr.completion_time_seconds,
    sr.created_at,
    sr.completed_at
FROM survey_responses sr
JOIN surveys s ON sr.survey_id = s.id
JOIN organizations o ON s.organization_id = o.id
ORDER BY sr.created_at DESC
LIMIT 20;

-- =====================================================
-- SURVEY ANALYTICS
-- =====================================================

-- Survey Performance by Organization
-- Use Case: Compare survey engagement across organizations
SELECT 
    o.name as organization_name,
    COUNT(s.id) as total_surveys,
    COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_surveys,
    COUNT(sr.id) as total_responses,
    COUNT(CASE WHEN sr.status = 'completed' THEN 1 END) as completed_responses,
    ROUND(
        COUNT(CASE WHEN sr.status = 'completed' THEN 1 END)::DECIMAL / 
        NULLIF(COUNT(sr.id), 0) * 100, 2
    ) as avg_completion_rate
FROM organizations o
LEFT JOIN surveys s ON o.id = s.organization_id
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
GROUP BY o.id, o.name
HAVING COUNT(s.id) > 0
ORDER BY total_responses DESC;

-- Survey Template Usage Statistics
-- Use Case: Understand which templates are most popular
SELECT 
    st.id,
    st.name as template_name,
    st.category,
    COUNT(s.id) as times_used,
    COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_instances,
    COUNT(sr.id) as total_responses,
    COUNT(CASE WHEN sr.status = 'completed' THEN 1 END) as completed_responses
FROM survey_templates st
LEFT JOIN surveys s ON st.id = s.template_id
LEFT JOIN survey_responses sr ON s.id = sr.survey_id
GROUP BY st.id, st.name, st.category
HAVING COUNT(s.id) > 0
ORDER BY times_used DESC, total_responses DESC;

-- =====================================================
-- SURVEY CONTENT ANALYSIS
-- =====================================================

-- Question Types in Templates
-- Use Case: Understand survey complexity and question types
SELECT 
    st.name as template_name,
    question->>'type' as question_type,
    COUNT(*) as question_count
FROM survey_templates st,
     jsonb_array_elements(st.template_schema->'sections') AS section,
     jsonb_array_elements(section->'questions') AS question
GROUP BY st.name, question->>'type'
ORDER BY st.name, question_count DESC;

-- Survey Sections Analysis
-- Use Case: Understand survey structure
SELECT 
    st.name as template_name,
    section->>'title' as section_title,
    jsonb_array_length(section->'questions') as question_count
FROM survey_templates st,
     jsonb_array_elements(st.template_schema->'sections') AS section
ORDER BY st.name, question_count DESC;

-- =====================================================
-- UTILITY QUERIES
-- =====================================================

-- Survey System Health Check
-- Use Case: Verify survey system integrity
SELECT 
    'survey_templates' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_public = true THEN 1 END) as public_templates
FROM survey_templates

UNION ALL

SELECT 
    'surveys' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_surveys
FROM surveys

UNION ALL

SELECT 
    'survey_responses' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_responses
FROM survey_responses;

-- Find Surveys Without Templates
-- Use Case: Identify surveys that need template assignment
SELECT 
    s.id,
    s.title,
    o.name as organization_name,
    s.created_at
FROM surveys s
LEFT JOIN survey_templates st ON s.template_id = st.id
LEFT JOIN organizations o ON s.organization_id = o.id
WHERE s.template_id IS NULL
ORDER BY s.created_at DESC;
