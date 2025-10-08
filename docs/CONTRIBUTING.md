# Contributing to Infra24

## 🤝 How to Contribute

We welcome contributions to Infra24! This guide will help you get started with contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (via Supabase)
- Clerk authentication account
- Git

### Setup Development Environment
```bash
# Clone repository
git clone <repository-url>
cd infra24

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start Supabase
npx supabase start

# Setup database
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/setup-complete-database-schema.sql

# Start development server
npm run dev
```

## 📋 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Follow established code patterns
- Write clear, readable code
- Add comments for complex logic
- Update documentation as needed

### 3. Test Changes
```bash
# Test database connection
node scripts/test-database-connection.js

# Test API endpoints
curl "http://localhost:3000/api/health"

# Run linting
npm run lint
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

## 🎯 Areas for Contribution

### Frontend Development
- **Components**: Create reusable React components
- **Pages**: Build new pages and features
- **Styling**: Improve UI/UX with Tailwind CSS
- **Mobile**: Enhance mobile experience

### Backend Development
- **API Routes**: Create new API endpoints
- **Database**: Optimize queries and schema
- **Authentication**: Improve security and user management
- **Integration**: Add third-party service integrations

### Documentation
- **User Guides**: Write user-facing documentation
- **API Docs**: Document API endpoints
- **Tutorials**: Create step-by-step guides
- **Examples**: Provide code examples

### Testing
- **Unit Tests**: Write component tests
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test user workflows
- **Performance**: Optimize performance

## 📝 Code Standards

### TypeScript
- Use TypeScript throughout
- Define proper interfaces
- Use strict type checking
- Avoid `any` types

### React Components
- Use functional components
- Implement proper prop types
- Use hooks appropriately
- Follow naming conventions

### API Routes
- Use proper HTTP methods
- Implement error handling
- Validate input data
- Return consistent responses

### Database
- Use proper SQL syntax
- Implement proper indexes
- Use transactions when needed
- Follow naming conventions

## 🧪 Testing

### Database Testing
```bash
# Test database connection
node scripts/test-database-connection.js

# Test specific queries
psql postgresql://postgres:postgres@localhost:54322/postgres -f scripts/test-user-progress-structure.sql
```

### API Testing
```bash
# Test availability API
curl "http://localhost:3000/api/availability?resource_id=remote_visit&start_date=2025-10-01&end_date=2025-10-07"

# Test booking creation
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{"org_id":"2133fe94-fb12-41f8-ab37-ea4acd4589f6","resource_id":"remote_visit","start_time":"2025-10-07T12:00:00-04:00","end_time":"2025-10-07T12:30:00-04:00","artist_name":"Test Artist","artist_email":"test@example.com","goal_text":"Test booking"}'
```

### Frontend Testing
- Test components in isolation
- Test user interactions
- Test responsive design
- Test accessibility

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex logic
- Explain design decisions
- Update README files

### API Documentation
- Document all endpoints
- Provide examples
- Explain parameters
- Document error responses

### User Documentation
- Write clear user guides
- Provide step-by-step instructions
- Include screenshots
- Update FAQ

## 🐛 Bug Reports

### Before Reporting
1. Check existing issues
2. Test with latest version
3. Try to reproduce the bug
4. Check documentation

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 1.0.0]

**Additional Context**
Any other context about the problem.
```

## 🚀 Feature Requests

### Before Requesting
1. Check existing feature requests
2. Consider the use case
3. Think about implementation
4. Check project roadmap

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should this feature work?

**Alternatives**
Any alternative solutions considered.

**Additional Context**
Any other context about the feature.
```

## 🔧 Development Tools

### Recommended Tools
- **VS Code**: Code editor
- **Postman**: API testing
- **pgAdmin**: Database management
- **Chrome DevTools**: Frontend debugging

### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **PostgreSQL**

## 📊 Performance

### Frontend Performance
- Optimize images
- Use lazy loading
- Minimize bundle size
- Implement caching

### Backend Performance
- Optimize database queries
- Use proper indexes
- Implement caching
- Monitor performance

### Database Performance
- Use proper indexes
- Optimize queries
- Monitor query performance
- Use connection pooling

## 🔐 Security

### Security Best Practices
- Validate input data
- Use proper authentication
- Implement rate limiting
- Regular security audits

### Authentication
- Use Clerk properly
- Implement proper middleware
- Secure API endpoints
- Handle user sessions

### Data Protection
- Encrypt sensitive data
- Use proper permissions
- Implement audit logs
- Regular backups

## 📞 Getting Help

### Resources
- **Documentation**: Check `docs/` directory
- **Issues**: GitHub issues
- **Discussions**: GitHub discussions
- **Team**: Contact development team

### Communication
- **Issues**: Use GitHub issues for bugs and features
- **Discussions**: Use GitHub discussions for questions
- **Pull Requests**: Use PR comments for code review
- **Email**: Contact team for sensitive issues

## 🎉 Recognition

### Contributors
We recognize all contributors in our project documentation and release notes.

### Types of Contributions
- **Code**: Bug fixes, features, improvements
- **Documentation**: Guides, tutorials, examples
- **Testing**: Bug reports, test cases
- **Design**: UI/UX improvements, mockups

## 📋 Checklist

### Before Submitting
- [ ] Code follows project standards
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessibility considered

### Pull Request
- [ ] Clear description
- [ ] Related issues linked
- [ ] Screenshots if UI changes
- [ ] Breaking changes documented
- [ ] Ready for review

---

Thank you for contributing to Infra24! 🎉

*Last updated: September 30, 2025*