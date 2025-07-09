import { validateContent } from "./content-validation";

// Database protection middleware
export function protectContentDatabase(req: any, res: any, next: any) {
  const { method, path, body } = req;
  
  // Block any direct DELETE operations on content tables
  if (method === 'DELETE' && path.includes('/content')) {
    return res.status(403).json({
      error: "Content deletion forbidden",
      message: "Content deletion requires explicit user approval per DATABASE_PROTECTION_PROTOCOL.md",
      action: "Contact administrator for content removal"
    });
  }
  
  // Block any direct database manipulation without validation
  if (method === 'POST' && path.includes('/content') && !path.includes('/validate')) {
    if (!path.includes('/create-day')) {
      return res.status(403).json({
        error: "Direct content creation forbidden",
        message: "All content must pass framework validation through /api/content/create-day",
        framework: "CONTENT_CREATION_FRAMEWORK.md"
      });
    }
  }
  
  // Block UPDATE operations that don't go through validation
  if (method === 'PUT' && path.includes('/content')) {
    if (!path.includes('/approved')) {
      return res.status(403).json({
        error: "Content modification forbidden",
        message: "Content updates must pass framework validation",
        framework: "CONTENT_CREATION_FRAMEWORK.md"
      });
    }
  }
  
  next();
}

// Framework compliance checker for all content operations
export function ensureFrameworkCompliance(content: any): { approved: boolean; violations: string[] } {
  const violations: string[] = [];
  
  // Check if content has been validated
  if (!content.frameworkValidated) {
    violations.push("Content has not been validated against framework requirements");
  }
  
  // Check for required Bitcoin relevance
  if (!content.lessonContent?.toLowerCase().includes('bitcoin')) {
    violations.push("Content must explicitly mention Bitcoin for relevance");
  }
  
  // Check for prohibited generic linking phrases
  const prohibitedPhrases = [
    'yesterday we learned',
    'building on our previous',
    'as we discovered',
    'continuing from where'
  ];
  
  const hasProhibitedPhrases = prohibitedPhrases.some(phrase => 
    content.lessonContent?.toLowerCase().includes(phrase)
  );
  
  if (hasProhibitedPhrases) {
    violations.push("Content contains prohibited generic linking phrases");
  }
  
  // Check title requirements
  if (content.title && content.title.length > 60) {
    violations.push("Title exceeds 60 character limit for mobile optimization");
  }
  
  if (content.title && !/[!?()]/.test(content.title)) {
    violations.push("Title lacks urgency indicators (!, ?, parentheses)");
  }
  
  return {
    approved: violations.length === 0,
    violations
  };
}

// Content approval status tracker
export class ContentApprovalTracker {
  private approvedContent: Set<string> = new Set();
  
  markAsApproved(contentId: string) {
    this.approvedContent.add(contentId);
  }
  
  isApproved(contentId: string): boolean {
    return this.approvedContent.has(contentId);
  }
  
  requiresApproval(contentId: string): boolean {
    return !this.isApproved(contentId);
  }
}

export const approvalTracker = new ContentApprovalTracker();

// Database operation logging
export function logContentOperation(operation: string, content: any, user: any) {
  console.log(`[CONTENT_PROTECTION] ${operation} by user ${user.id}:`, {
    timestamp: new Date().toISOString(),
    operation,
    userId: user.id,
    contentType: content.type || 'unknown',
    frameworkValidated: content.frameworkValidated || false,
    approved: content.approved || false
  });
}

// Emergency content restoration
export function createContentBackup(content: any) {
  const backup = {
    timestamp: new Date().toISOString(),
    operation: 'backup',
    data: content,
    reason: 'Pre-operation backup for data protection'
  };
  
  // In production, this would save to a secure backup location
  console.log('[CONTENT_BACKUP] Created backup:', backup);
  return backup;
}

// Framework validation enforcement
export function enforceFrameworkValidation(content: any): boolean {
  try {
    const validation = validateContent(content);
    return validation.isValid;
  } catch (error) {
    console.error('[FRAMEWORK_VALIDATION] Error during validation:', error);
    return false;
  }
}