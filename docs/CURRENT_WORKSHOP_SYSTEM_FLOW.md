# Current Workshop System Flow

## 🎯 **Workshop Visibility & Navigation**

### **1. Workshop Discovery**
```
/o/oolite/workshops → Workshop listing page
├── Featured workshops (with Learn content)
├── Published workshops
└── Workshop cards with "Learn" badges
```

### **2. Individual Workshop Pages**
```
/o/oolite/workshops/[workshop-id] → Workshop detail page
├── Workshop header (title, description, instructor, etc.)
├── Tab Navigation:
│   ├── "Details" Tab → Traditional workshop info
│   └── "Learn" Tab → Interactive learning content
└── Action buttons (Book Workshop, View All Workshops)
```

### **3. Learn Tab Content**
```
Learn Tab (when has_learn_content = true)
├── Chapter navigation sidebar
├── Interactive content area
│   ├── MDX content rendering
│   ├── Quizzes and activities
│   ├── Progress tracking
│   └── Chapter navigation
└── Learning objectives and materials
```

### **4. Content Management**
```
/content → Content management system
├── Workshop selection sidebar
├── Chapter management
├── Real-time MDX editing
├── Preview functionality
└── Save/publish workflow
```

## 📊 **Current Workshop Data Structure**

### **Workshops Table**
- `has_learn_content` → Shows Learn tab
- `learning_objectives` → Learning goals
- `estimated_learn_time` → Duration
- `learn_difficulty` → Beginner/Intermediate/Advanced
- `prerequisites` → Required knowledge
- `materials_needed` → Required materials

### **Workshop Chapters Table**
- `chapter_slug` → URL-friendly identifier
- `title` → Chapter name
- `description` → Chapter summary
- `order_index` → Chapter sequence
- `estimated_time` → Chapter duration

## 🎨 **User Experience Flow**

1. **Discovery**: User browses workshops on `/o/oolite/workshops`
2. **Selection**: User clicks on a workshop with Learn content
3. **Overview**: User sees workshop details and tabs
4. **Learning**: User clicks "Learn" tab to access interactive content
5. **Navigation**: User progresses through chapters
6. **Engagement**: User completes quizzes and activities
7. **Progress**: System tracks learning progress

## 🔧 **Technical Implementation**

### **Frontend Components**
- `WorkshopLearnContent` → Main learning interface
- `ChapterReader` → Individual chapter display
- `Quiz`, `Activity` → Interactive components
- Tab navigation with theme-aware styling

### **Backend APIs**
- `/api/workshops/[id]/chapters` → Chapter data
- `/api/workshops/[id]/progress` → User progress
- `/api/content/workshops/[workshopId]/chapters/[chapterSlug]` → Content management

### **Content Storage**
- MDX files in `content/workshops/oolite/[workshop-name]/chapters/`
- Database metadata in `workshop_chapters` table
- User progress in `user_workshop_progress` table
