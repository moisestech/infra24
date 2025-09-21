-- Survey System Database Schema for Infra24 Multi-tenant Platform
-- This schema supports comprehensive survey management across organizations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Survey templates table (reusable survey definitions)
CREATE TABLE survey_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('staff', 'resident', 'public', 'feedback', 'assessment', 'custom')),
    template_schema JSONB NOT NULL DEFAULT '{}', -- JSON schema defining survey structure
    is_public BOOLEAN DEFAULT false, -- Whether template can be used by other orgs
    created_by TEXT NOT NULL, -- Clerk user ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Surveys table (organization-specific survey instances)
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    template_id UUID REFERENCES survey_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
    
    -- Survey configuration
    is_anonymous BOOLEAN DEFAULT true,
    language_default TEXT DEFAULT 'en' CHECK (language_default IN ('en', 'es')),
    languages_supported TEXT[] DEFAULT ARRAY['en'],
    
    -- Access control
    requires_authentication BOOLEAN DEFAULT false,
    allowed_roles TEXT[] DEFAULT ARRAY['staff', 'resident', 'public'],
    
    -- Scheduling
    opens_at TIMESTAMP WITH TIME ZONE,
    closes_at TIMESTAMP WITH TIME ZONE,
    
    -- Response limits
    max_responses INTEGER,
    max_responses_per_user INTEGER DEFAULT 1,
    
    -- Survey structure (JSON schema)
    survey_schema JSONB NOT NULL DEFAULT '{}',
    
    -- Settings
    settings JSONB DEFAULT '{}', -- Additional survey settings
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT NOT NULL, -- Clerk user ID
    updated_by TEXT NOT NULL -- Clerk user ID
);

-- Survey invitations table (for targeted surveys)
CREATE TABLE survey_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT, -- staff, resident, public, etc.
    magic_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'completed', 'expired')),
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Survey responses table
CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    invitation_id UUID REFERENCES survey_invitations(id) ON DELETE SET NULL,
    
    -- Respondent information (nullable for anonymous surveys)
    respondent_email TEXT,
    respondent_name TEXT,
    respondent_role TEXT,
    user_id TEXT, -- Clerk user ID (nullable for anonymous)
    
    -- Response data
    responses JSONB NOT NULL DEFAULT '{}', -- The actual survey responses
    language_used TEXT DEFAULT 'en',
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    completion_time_seconds INTEGER,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Survey analytics table (aggregated metrics)
CREATE TABLE survey_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(survey_id, date, metric_name)
);

-- Survey comments table (for internal notes)
CREATE TABLE survey_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_survey_templates_category ON survey_templates(category);
CREATE INDEX idx_survey_templates_is_public ON survey_templates(is_public);
CREATE INDEX idx_survey_templates_created_by ON survey_templates(created_by);

CREATE INDEX idx_surveys_organization_id ON surveys(organization_id);
CREATE INDEX idx_surveys_template_id ON surveys(template_id);
CREATE INDEX idx_surveys_status ON surveys(status);
CREATE INDEX idx_surveys_opens_at ON surveys(opens_at);
CREATE INDEX idx_surveys_closes_at ON surveys(closes_at);
CREATE INDEX idx_surveys_created_by ON surveys(created_by);

CREATE INDEX idx_survey_invitations_survey_id ON survey_invitations(survey_id);
CREATE INDEX idx_survey_invitations_email ON survey_invitations(email);
CREATE INDEX idx_survey_invitations_magic_token ON survey_invitations(magic_token);
CREATE INDEX idx_survey_invitations_status ON survey_invitations(status);
CREATE INDEX idx_survey_invitations_expires_at ON survey_invitations(expires_at);

CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_responses_invitation_id ON survey_responses(invitation_id);
CREATE INDEX idx_survey_responses_respondent_email ON survey_responses(respondent_email);
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX idx_survey_responses_status ON survey_responses(status);
CREATE INDEX idx_survey_responses_completed_at ON survey_responses(completed_at);

CREATE INDEX idx_survey_analytics_survey_id ON survey_analytics(survey_id);
CREATE INDEX idx_survey_analytics_organization_id ON survey_analytics(organization_id);
CREATE INDEX idx_survey_analytics_date ON survey_analytics(date);
CREATE INDEX idx_survey_analytics_metric_name ON survey_analytics(metric_name);

CREATE INDEX idx_survey_comments_survey_id ON survey_comments(survey_id);
CREATE INDEX idx_survey_comments_user_id ON survey_comments(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE survey_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for survey_templates
CREATE POLICY "Users can view public templates" ON survey_templates
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view templates for their organization" ON survey_templates
    FOR SELECT USING (
        created_by = auth.uid()::text OR
        id IN (
            SELECT template_id FROM surveys 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Admins can manage templates" ON survey_templates
    FOR ALL USING (
        created_by = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM org_memberships 
            WHERE user_id = auth.uid()::text 
            AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for surveys
CREATE POLICY "Users can view surveys for their organization" ON surveys
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        ) OR
        (status = 'active' AND requires_authentication = false)
    );

CREATE POLICY "Admins can manage surveys for their organization" ON surveys
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
        )
    );

-- RLS Policies for survey_invitations
CREATE POLICY "Users can view invitations for their organization surveys" ON survey_invitations
    FOR SELECT USING (
        survey_id IN (
            SELECT id FROM surveys 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Users can view their own invitations" ON survey_invitations
    FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can manage invitations" ON survey_invitations
    FOR ALL USING (
        survey_id IN (
            SELECT id FROM surveys 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
            )
        )
    );

-- RLS Policies for survey_responses
CREATE POLICY "Users can view responses for their organization surveys" ON survey_responses
    FOR SELECT USING (
        survey_id IN (
            SELECT id FROM surveys 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Users can view their own responses" ON survey_responses
    FOR SELECT USING (
        user_id = auth.uid()::text OR
        respondent_email = auth.jwt() ->> 'email'
    );

CREATE POLICY "Users can create responses" ON survey_responses
    FOR INSERT WITH CHECK (
        survey_id IN (
            SELECT id FROM surveys 
            WHERE status = 'active' AND (
                organization_id IN (
                    SELECT organization_id FROM org_memberships 
                    WHERE user_id = auth.uid()::text
                ) OR
                requires_authentication = false
            )
        )
    );

CREATE POLICY "Users can update their own responses" ON survey_responses
    FOR UPDATE USING (
        user_id = auth.uid()::text OR
        respondent_email = auth.jwt() ->> 'email'
    );

-- RLS Policies for survey_analytics
CREATE POLICY "Users can view analytics for their organization" ON survey_analytics
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM org_memberships 
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "System can insert analytics" ON survey_analytics
    FOR INSERT WITH CHECK (true);

-- RLS Policies for survey_comments
CREATE POLICY "Users can view comments for their organization surveys" ON survey_comments
    FOR SELECT USING (
        survey_id IN (
            SELECT id FROM surveys 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text
            )
        )
    );

CREATE POLICY "Users can manage comments for their organization surveys" ON survey_comments
    FOR ALL USING (
        user_id = auth.uid()::text OR
        survey_id IN (
            SELECT id FROM surveys 
            WHERE organization_id IN (
                SELECT organization_id FROM org_memberships 
                WHERE user_id = auth.uid()::text AND role IN ('admin', 'manager')
            )
        )
    );

-- Functions for survey management
CREATE OR REPLACE FUNCTION update_survey_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to update timestamps
CREATE TRIGGER trigger_update_survey_templates_updated_at
    BEFORE UPDATE ON survey_templates
    FOR EACH ROW EXECUTE FUNCTION update_survey_updated_at();

CREATE TRIGGER trigger_update_surveys_updated_at
    BEFORE UPDATE ON surveys
    FOR EACH ROW EXECUTE FUNCTION update_survey_updated_at();

CREATE TRIGGER trigger_update_survey_invitations_updated_at
    BEFORE UPDATE ON survey_invitations
    FOR EACH ROW EXECUTE FUNCTION update_survey_updated_at();

CREATE TRIGGER trigger_update_survey_responses_updated_at
    BEFORE UPDATE ON survey_responses
    FOR EACH ROW EXECUTE FUNCTION update_survey_updated_at();

CREATE TRIGGER trigger_update_survey_comments_updated_at
    BEFORE UPDATE ON survey_comments
    FOR EACH ROW EXECUTE FUNCTION update_survey_updated_at();

-- Function to generate survey analytics
CREATE OR REPLACE FUNCTION generate_survey_analytics(
    p_survey_id UUID,
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
DECLARE
    v_organization_id UUID;
BEGIN
    -- Get organization ID from survey
    SELECT organization_id INTO v_organization_id
    FROM surveys WHERE id = p_survey_id;
    
    -- Total responses for the day
    INSERT INTO survey_analytics (survey_id, organization_id, date, metric_name, metric_value)
    SELECT 
        p_survey_id,
        v_organization_id,
        p_date,
        'total_responses',
        COUNT(*)
    FROM survey_responses
    WHERE survey_id = p_survey_id
    AND DATE(created_at) = p_date
    AND status = 'completed'
    ON CONFLICT (survey_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Completion rate
    INSERT INTO survey_analytics (survey_id, organization_id, date, metric_name, metric_value)
    SELECT 
        p_survey_id,
        v_organization_id,
        p_date,
        'completion_rate',
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100
        END
    FROM survey_responses
    WHERE survey_id = p_survey_id
    AND DATE(created_at) = p_date
    ON CONFLICT (survey_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Average completion time
    INSERT INTO survey_analytics (survey_id, organization_id, date, metric_name, metric_value)
    SELECT 
        p_survey_id,
        v_organization_id,
        p_date,
        'avg_completion_time_seconds',
        COALESCE(AVG(completion_time_seconds), 0)
    FROM survey_responses
    WHERE survey_id = p_survey_id
    AND DATE(created_at) = p_date
    AND status = 'completed'
    AND completion_time_seconds IS NOT NULL
    ON CONFLICT (survey_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Responses by role
    INSERT INTO survey_analytics (survey_id, organization_id, date, metric_name, metric_value)
    SELECT 
        p_survey_id,
        v_organization_id,
        p_date,
        'responses_by_role_' || COALESCE(respondent_role, 'anonymous'),
        COUNT(*)
    FROM survey_responses
    WHERE survey_id = p_survey_id
    AND DATE(created_at) = p_date
    AND status = 'completed'
    GROUP BY respondent_role
    ON CONFLICT (survey_id, date, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
END;
$$ LANGUAGE plpgsql;

-- Function to send survey invitation
CREATE OR REPLACE FUNCTION send_survey_invitation(
    p_survey_id UUID,
    p_email TEXT,
    p_name TEXT DEFAULT NULL,
    p_role TEXT DEFAULT NULL,
    p_expires_in_hours INTEGER DEFAULT 168 -- 7 days
)
RETURNS UUID AS $$
DECLARE
    v_invitation_id UUID;
    v_magic_token TEXT;
BEGIN
    -- Generate unique magic token
    v_magic_token := encode(gen_random_bytes(32), 'hex');
    
    -- Create invitation
    INSERT INTO survey_invitations (
        survey_id, email, name, role, magic_token, expires_at
    ) VALUES (
        p_survey_id, p_email, p_name, p_role, v_magic_token, 
        NOW() + (p_expires_in_hours || ' hours')::INTERVAL
    ) RETURNING id INTO v_invitation_id;
    
    RETURN v_invitation_id;
END;
$$ LANGUAGE plpgsql;

-- Insert default survey templates
INSERT INTO survey_templates (name, description, category, template_schema, is_public, created_by) VALUES
(
    'Staff Digital Skills & Workflow Survey',
    'Comprehensive survey to assess staff digital skills and workflow needs for training and tool selection',
    'staff',
    '{
        "title": {"en": "Staff Digital Skills & Workflow Survey", "es": "Encuesta de Habilidades Digitales del Personal"},
        "description": {"en": "Help us design useful trainings for your daily work. Your responses are not used for performance reviews.", "es": "Ayúdanos a diseñar capacitaciones útiles para su trabajo diario. Sus respuestas no se usan para evaluaciones de desempeño."},
        "sections": [
            {
                "title": {"en": "About you", "es": "Sobre usted"},
                "questions": [
                    {
                        "id": "department",
                        "type": "single_choice",
                        "prompt": {"en": "Department / Team", "es": "Departamento / Equipo"},
                        "required": true,
                        "options": [
                            {"label": {"en": "Comms/Marketing", "es": "Comunicaciones/Marketing"}, "value": "comms"},
                            {"label": {"en": "Education", "es": "Educación"}, "value": "education"},
                            {"label": {"en": "Exhibitions/Residency", "es": "Exhibiciones/Residencia"}, "value": "exhibitions"},
                            {"label": {"en": "Development/Grants", "es": "Desarrollo/Subvenciones"}, "value": "development"},
                            {"label": {"en": "Admin/IT", "es": "Administración/TI"}, "value": "admin"},
                            {"label": {"en": "Facilities/FOH", "es": "Instalaciones/Atención al público"}, "value": "facilities"},
                            {"label": {"en": "Other", "es": "Otro"}, "value": "other"}
                        ]
                    },
                    {
                        "id": "role_responsibilities",
                        "type": "long_text",
                        "prompt": {"en": "Role & primary responsibilities (1-2 sentences)", "es": "Rol y responsabilidades principales (1-2 oraciones)"},
                        "required": true
                    },
                    {
                        "id": "public_interaction",
                        "type": "single_choice",
                        "prompt": {"en": "How often do you work directly with artists or the public?", "es": "¿Con qué frecuencia trabaja directamente con artistas o el público?"},
                        "required": true,
                        "options": [
                            {"label": {"en": "Daily", "es": "Diariamente"}, "value": "daily"},
                            {"label": {"en": "Weekly", "es": "Semanalmente"}, "value": "weekly"},
                            {"label": {"en": "Monthly", "es": "Mensualmente"}, "value": "monthly"},
                            {"label": {"en": "Rarely", "es": "Raramente"}, "value": "rarely"}
                        ]
                    },
                    {
                        "id": "language_preference",
                        "type": "multi_choice",
                        "prompt": {"en": "Language comfort for trainings (check all that apply)", "es": "Idioma preferido para capacitaciones (marca todos los que apliquen)"},
                        "required": true,
                        "options": [
                            {"label": {"en": "English", "es": "Inglés"}, "value": "en"},
                            {"label": {"en": "Español", "es": "Español"}, "value": "es"},
                            {"label": {"en": "Bilingual materials preferred", "es": "Material bilingüe preferido"}, "value": "bilingual"}
                        ]
                    }
                ]
            },
            {
                "title": {"en": "Current tools & confidence", "es": "Herramientas actuales y confianza"},
                "questions": [
                    {
                        "id": "tool_confidence",
                        "type": "matrix",
                        "prompt": {"en": "Rate your comfort with each tool (1-5)", "es": "Califica tu dominio con cada herramienta (1-5)"},
                        "required": false,
                        "scale": {"min": 1, "max": 5, "labels": {"1": "Not familiar", "5": "Can teach others"}},
                        "tools": [
                            {"label": {"en": "Gmail/Outlook", "es": "Gmail/Outlook"}, "value": "email"},
                            {"label": {"en": "Google Sheets", "es": "Google Sheets"}, "value": "sheets"},
                            {"label": {"en": "Canva", "es": "Canva"}, "value": "canva"},
                            {"label": {"en": "Adobe (Ps/Ai/Pr/Ae)", "es": "Adobe (Ps/Ai/Pr/Ae)"}, "value": "adobe"},
                            {"label": {"en": "DaVinci Resolve", "es": "DaVinci Resolve"}, "value": "resolve"},
                            {"label": {"en": "OBS / YouTube Studio", "es": "OBS / YouTube Studio"}, "value": "obs"},
                            {"label": {"en": "n8n / Zapier / Make", "es": "n8n / Zapier / Make"}, "value": "automation"},
                            {"label": {"en": "GA4 / Plausible", "es": "GA4 / Plausible"}, "value": "analytics"},
                            {"label": {"en": "3-D printing basics", "es": "Impresión 3-D básica"}, "value": "3d"}
                        ]
                    }
                ]
            },
            {
                "title": {"en": "Workflows & bottlenecks", "es": "Flujos de trabajo y obstáculos"},
                "questions": [
                    {
                        "id": "top_workflows",
                        "type": "multi_choice",
                        "prompt": {"en": "Pick the top workflows you do most", "es": "Elige tus flujos más frecuentes"},
                        "required": true,
                        "options": [
                            {"label": {"en": "Announce an event", "es": "Anunciar un evento"}, "value": "announce"},
                            {"label": {"en": "Manage RSVPs", "es": "Gestionar RSVPs"}, "value": "rsvp"},
                            {"label": {"en": "Publish program page", "es": "Publicar página de programa"}, "value": "page"},
                            {"label": {"en": "Document talk/exhibition", "es": "Documentar charla/exposición"}, "value": "doc"},
                            {"label": {"en": "Grant/board report", "es": "Informe para subvención/junta"}, "value": "report"},
                            {"label": {"en": "Resident media intake", "es": "Ingreso de media de residentes"}, "value": "resident_media"}
                        ]
                    },
                    {
                        "id": "bottlenecks",
                        "type": "long_text",
                        "prompt": {"en": "Where do you lose time or get blocked?", "es": "¿Dónde se pierde tiempo o te bloqueas?"},
                        "required": true
                    },
                    {
                        "id": "improvement_ideas",
                        "type": "long_text",
                        "prompt": {"en": "What would make this 10× easier?", "es": "¿Qué lo haría 10× más fácil?"},
                        "required": true
                    }
                ]
            },
            {
                "title": {"en": "Training preferences", "es": "Preferencias de capacitación"},
                "questions": [
                    {
                        "id": "training_formats",
                        "type": "multi_choice",
                        "prompt": {"en": "Formats you''ll actually use", "es": "Formatos que realmente usarías"},
                        "required": true,
                        "options": [
                            {"label": {"en": "90-min hands-on", "es": "90 min práctico"}, "value": "hands_on"},
                            {"label": {"en": "45-min demo + SOP", "es": "45 min demo + SOP"}, "value": "demo"},
                            {"label": {"en": "Recorded micro-videos", "es": "Micro-videos grabados"}, "value": "micro"},
                            {"label": {"en": "Office hours", "es": "Oficina de dudas"}, "value": "oh"},
                            {"label": {"en": "Self-paced checklist", "es": "Checklist a tu ritmo"}, "value": "checklist"}
                        ]
                    },
                    {
                        "id": "best_times",
                        "type": "multi_choice",
                        "prompt": {"en": "Best times to meet", "es": "Mejores horarios"},
                        "required": true,
                        "options": [
                            {"label": {"en": "Tue–Thu 10–12", "es": "Mar–Jue 10–12"}, "value": "tt_am"},
                            {"label": {"en": "Tue–Thu 2–4", "es": "Mar–Jue 14–16"}, "value": "tt_pm"},
                            {"label": {"en": "After 5:30 pm (occasionally)", "es": "Después de 17:30 (ocasional)"}, "value": "eve"},
                            {"label": {"en": "Fri AM", "es": "Vie AM"}, "value": "fri_am"},
                            {"label": {"en": "Sat AM (rare)", "es": "Sáb AM (raro)"}, "value": "sat_am"}
                        ]
                    }
                ]
            },
            {
                "title": {"en": "Pilot & follow-up", "es": "Piloto y seguimiento"},
                "questions": [
                    {
                        "id": "pilot_champion",
                        "type": "single_choice",
                        "prompt": {"en": "Be a pilot champion?", "es": "¿Ser ''champion'' piloto?"},
                        "required": true,
                        "options": [
                            {"label": {"en": "Yes", "es": "Sí"}, "value": "yes"},
                            {"label": {"en": "Maybe", "es": "Tal vez"}, "value": "maybe"},
                            {"label": {"en": "Not now", "es": "Ahora no"}, "value": "no"}
                        ]
                    },
                    {
                        "id": "additional_info",
                        "type": "long_text",
                        "prompt": {"en": "Anything else we should know?", "es": "¿Algo más que debamos saber?"},
                        "required": false
                    }
                ]
            }
        ]
    }',
    true,
    'system'
),
(
    'Digital Lab Experience Survey',
    'Survey to gather feedback on Digital Lab equipment, staff, and programs',
    'feedback',
    '{
        "title": {"en": "Digital Lab Experience Survey", "es": "Encuesta de Experiencia del Laboratorio Digital"},
        "description": {"en": "Help us improve the Digital Lab by sharing your experience and feedback.", "es": "Ayúdanos a mejorar el Laboratorio Digital compartiendo tu experiencia y comentarios."},
        "sections": [
            {
                "title": {"en": "Experience Level", "es": "Nivel de Experiencia"},
                "questions": [
                    {
                        "id": "experience_level",
                        "type": "single_choice",
                        "prompt": {"en": "What is your experience level with digital arts?", "es": "¿Cuál es tu nivel de experiencia con artes digitales?"},
                        "required": true,
                        "options": [
                            {"label": {"en": "Complete beginner", "es": "Principiante completo"}, "value": "beginner"},
                            {"label": {"en": "Some experience", "es": "Alguna experiencia"}, "value": "some"},
                            {"label": {"en": "Intermediate", "es": "Intermedio"}, "value": "intermediate"},
                            {"label": {"en": "Advanced", "es": "Avanzado"}, "value": "advanced"},
                            {"label": {"en": "Professional", "es": "Profesional"}, "value": "professional"}
                        ]
                    }
                ]
            },
            {
                "title": {"en": "Lab Usage", "es": "Uso del Laboratorio"},
                "questions": [
                    {
                        "id": "usage_frequency",
                        "type": "single_choice",
                        "prompt": {"en": "How often do you use the Digital Lab?", "es": "¿Con qué frecuencia usas el Laboratorio Digital?"},
                        "required": true,
                        "options": [
                            {"label": {"en": "Daily", "es": "Diariamente"}, "value": "daily"},
                            {"label": {"en": "Weekly", "es": "Semanalmente"}, "value": "weekly"},
                            {"label": {"en": "Monthly", "es": "Mensualmente"}, "value": "monthly"},
                            {"label": {"en": "Occasionally", "es": "Ocasionalmente"}, "value": "occasionally"},
                            {"label": {"en": "This is my first time", "es": "Esta es mi primera vez"}, "value": "first_time"}
                        ]
                    }
                ]
            },
            {
                "title": {"en": "Ratings", "es": "Calificaciones"},
                "questions": [
                    {
                        "id": "equipment_rating",
                        "type": "rating",
                        "prompt": {"en": "How would you rate the equipment and technology available?", "es": "¿Cómo calificarías el equipo y la tecnología disponible?"},
                        "required": true,
                        "scale": {"min": 1, "max": 5, "labels": {"1": "Poor", "5": "Excellent"}}
                    },
                    {
                        "id": "staff_rating",
                        "type": "rating",
                        "prompt": {"en": "How would you rate the staff support and guidance?", "es": "¿Cómo calificarías el apoyo y la orientación del personal?"},
                        "required": true,
                        "scale": {"min": 1, "max": 5, "labels": {"1": "Poor", "5": "Excellent"}}
                    },
                    {
                        "id": "workshop_rating",
                        "type": "rating",
                        "prompt": {"en": "How would you rate the quality of workshops offered?", "es": "¿Cómo calificarías la calidad de los talleres ofrecidos?"},
                        "required": true,
                        "scale": {"min": 1, "max": 5, "labels": {"1": "Poor", "5": "Excellent"}}
                    }
                ]
            }
        ]
    }',
    true,
    'system'
);

