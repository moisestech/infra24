# SQL Script Reference System

This directory contains organized SQL scripts and queries for the Infra24 platform, organized by functionality and use case. Each script includes documentation, examples, and references to related documentation.

## 📁 Directory Structure

```
sql-reference/
├── README.md                           # This file
├── database-schema/                    # Database structure queries
│   ├── tables-overview.sql
│   ├── constraints-and-indexes.sql
│   └── relationships.sql
├── organizations/                      # Organization-related queries
│   ├── oolite-queries.sql
│   ├── bakehouse-queries.sql
│   └── organization-stats.sql
├── artists/                           # Artist management queries
│   ├── artist-profiles.sql
│   ├── residency-types.sql
│   └── artist-stats.sql
├── surveys/                           # Survey system queries
│   ├── survey-templates.sql
│   ├── survey-responses.sql
│   └── survey-analytics.sql
├── announcements/                     # Announcement system queries
│   ├── announcement-management.sql
│   └── announcement-stats.sql
├── bookings/                          # Booking system queries
│   ├── resources.sql
│   ├── bookings.sql
│   └── booking-analytics.sql
└── analytics/                         # Analytics and reporting queries
    ├── user-engagement.sql
    ├── platform-metrics.sql
    └── organization-kpis.sql
```

## 🎯 How to Use This System

### 1. **Quick Reference**
Each script includes:
- **Purpose**: What the query does
- **Use Case**: When to use it
- **Parameters**: What variables to modify
- **Related Docs**: Links to relevant documentation
- **Examples**: Sample usage

### 2. **Documentation Integration**
Scripts reference documentation files:
- `docs/OOLITE_ARTISTS_IMPLEMENTATION.md` → `artists/oolite-queries.sql`
- `docs/SURVEY_SYSTEM_COMPLETE_SUMMARY.md` → `surveys/survey-templates.sql`
- `docs/DIGITAL_LAB_ENHANCEMENTS.md` → `announcements/announcement-management.sql`

### 3. **Maintenance**
- **Update Scripts**: When database schema changes
- **Add Examples**: When new use cases arise
- **Cross-Reference**: Link related queries and documentation

## 🔍 Quick Search

### By Organization
- **Oolite Arts**: `organizations/oolite-queries.sql`
- **Bakehouse**: `organizations/bakehouse-queries.sql`

### By Feature
- **Artists**: `artists/` directory
- **Surveys**: `surveys/` directory
- **Bookings**: `bookings/` directory
- **Analytics**: `analytics/` directory

### By Data Type
- **Schema Info**: `database-schema/` directory
- **Statistics**: Look for `*-stats.sql` files
- **Management**: Look for `*-management.sql` files

## 📚 Related Documentation

- [Oolite Artists Implementation](../docs/OOLITE_ARTISTS_IMPLEMENTATION.md)
- [Survey System Complete Summary](../docs/SURVEY_SYSTEM_COMPLETE_SUMMARY.md)
- [Digital Lab Enhancements](../docs/DIGITAL_LAB_ENHANCEMENTS.md)
- [Booking System Strategy](../docs/BOOKING_SYSTEM_STRATEGY.md)
- [Database Schema](../docs/technical/DATABASE_SCHEMA.sql)

## 🚀 Getting Started

1. **Browse by Category**: Start with the directory that matches your need
2. **Read the Comments**: Each script has detailed documentation
3. **Modify Parameters**: Update organization IDs, date ranges, etc.
4. **Test First**: Run queries on development database first
5. **Document Changes**: Update scripts when you make modifications

## 💡 Tips

- **Use Variables**: Replace hardcoded IDs with variables for reusability
- **Add Comments**: Document complex queries for future reference
- **Version Control**: Track changes to important queries
- **Cross-Reference**: Link related queries and documentation
- **Test Regularly**: Ensure queries work with schema changes
