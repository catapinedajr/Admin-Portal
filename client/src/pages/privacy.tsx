import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200">
      {/* Header */}
      <div className="bg-zinc-800 border-b border-zinc-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Registration
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-orange-500">HODLearn Privacy Policy</h1>
              <p className="text-sm text-zinc-400">Last updated: July 31, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-zinc prose-invert max-w-none">
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-zinc-300 mb-3">Personal Information</h3>
            <p className="mb-4">When you register for HODLearn, we collect:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Name:</strong> First and last name for account personalization</li>
              <li><strong>Email:</strong> For account recovery and important communications</li>
              <li><strong>Username:</strong> Your chosen community alias for forum participation</li>
              <li><strong>Password:</strong> Securely hashed and stored for account access</li>
            </ul>

            <h3 className="text-lg font-medium text-zinc-300 mb-3">Usage Information</h3>
            <p className="mb-4">We automatically collect information about how you use our Service:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Learning progress and quiz completion data</li>
              <li>Community forum posts and interactions</li>
              <li>Page views and navigation patterns</li>
              <li>Device information and IP addresses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Provide the Service:</strong> Deliver educational content and track your progress</li>
              <li><strong>Personalize Experience:</strong> Customize content based on your learning journey</li>
              <li><strong>Community Features:</strong> Enable forum participation with your chosen username</li>
              <li><strong>Account Management:</strong> Send password resets and account notifications</li>
              <li><strong>Improve Service:</strong> Analyze usage patterns to enhance our platform</li>
              <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              <strong>We do not sell your personal information.</strong> We may share information in limited circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Public Forums:</strong> Your username is visible in community discussions</li>
              <li><strong>Service Providers:</strong> Third-party services that help operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">4. Data Security</h2>
            <p className="mb-4">We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Password hashing using bcrypt</li>
              <li>Secure database hosting and access controls</li>
              <li>Regular security audits and updates</li>
            </ul>
            <p className="mb-4">
              While we strive to protect your information, no system is completely secure. We encourage you to use strong, 
              unique passwords and keep your account credentials confidential.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">5. Your Privacy Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="mb-4">
              To exercise these rights, contact us at privacy@hodlearn.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">6. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze site usage and performance</li>
              <li>Provide personalized content recommendations</li>
            </ul>
            <p className="mb-4">
              You can control cookies through your browser settings, though this may affect Service functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">7. Data Retention</h2>
            <p className="mb-4">We retain your information for as long as necessary to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide you with our Service</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Prevent fraud and abuse</li>
            </ul>
            <p className="mb-4">
              When you delete your account, we will remove your personal information within 30 days, 
              except for information we must retain for legal reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">8. Children's Privacy</h2>
            <p className="mb-4">
              Our Service is not intended for children under 13. We do not knowingly collect personal information 
              from children under 13. If we learn we have collected such information, we will delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">9. International Users</h2>
            <p className="mb-4">
              HODLearn operates from [Your Country]. If you are accessing our Service from outside [Your Country], 
              your information may be transferred to and processed in [Your Country]. By using our Service, 
              you consent to this transfer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">10. Third-Party Services</h2>
            <p className="mb-4">Our Service may contain links to third-party websites or integrate with third-party services:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Educational video content from YouTube or similar platforms</li>
              <li>Analytics services to understand Service usage</li>
              <li>Payment processors for premium features</li>
            </ul>
            <p className="mb-4">
              These third parties have their own privacy policies. We are not responsible for their privacy practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">11. Changes to Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
              We will notify you of material changes via email or prominent notice on our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our privacy practices, contact us:
            </p>
            <p className="mb-4">
              Email: privacy@hodlearn.com<br />
              Address: [Your Business Address]
            </p>
          </section>

        </div>

        {/* Back to Registration Button */}
        <div className="mt-12 pt-8 border-t border-zinc-700">
          <Link href="/auth">
            <Button className="bg-orange-500 hover:bg-orange-600">
              Return to Registration
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}