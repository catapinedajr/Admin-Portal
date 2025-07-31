import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TermsPage() {
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
              <h1 className="text-2xl font-bold text-orange-500">HODLearn Terms of Service</h1>
              <p className="text-sm text-zinc-400">Last updated: July 31, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-zinc prose-invert max-w-none">
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By creating an account and using HODLearn ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you do not agree to these Terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">2. Description of Service</h2>
            <p className="mb-4">
              HODLearn is an educational platform focused on Bitcoin and cryptocurrency education. We provide:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Daily Bitcoin educational content and lessons</li>
              <li>Interactive quizzes and progress tracking</li>
              <li>Community forums for discussion and learning</li>
              <li>Educational simulations and tools</li>
              <li>Curated educational videos and resources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">3. Educational Purpose</h2>
            <p className="mb-4">
              <strong>Important:</strong> HODLearn provides educational content only. We do not provide financial advice, 
              investment recommendations, or trading guidance. All content is for informational and educational purposes. 
              You should consult with qualified financial professionals before making any investment decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">4. User Accounts and Registration</h2>
            <p className="mb-4">To use our Service, you must:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 13 years old (or the minimum age in your jurisdiction)</li>
              <li>Use your account responsibly and in compliance with these Terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">5. Community Guidelines</h2>
            <p className="mb-4">When participating in our community forums, you agree to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Be respectful and constructive in discussions</li>
              <li>Not post spam, promotional content, or off-topic material</li>
              <li>Not share personal financial information or trading advice</li>
              <li>Not engage in harassment, discrimination, or abusive behavior</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">6. Intellectual Property</h2>
            <p className="mb-4">
              HODLearn owns or licenses all content, trademarks, and intellectual property on the Service. 
              You may use our content for personal, educational purposes but may not reproduce, distribute, 
              or create derivative works without permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">7. Prohibited Uses</h2>
            <p className="mb-4">You may not use our Service to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate others or provide false information</li>
              <li>Distribute malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape or download content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">8. Disclaimers and Risk Warning</h2>
            <p className="mb-4">
              <strong>Cryptocurrency involves substantial risk.</strong> Bitcoin and cryptocurrency values can be extremely 
              volatile. Past performance does not indicate future results. You should never invest more than you can afford to lose.
            </p>
            <p className="mb-4">
              HODLearn provides educational content "as is" without warranties of any kind. We do not guarantee the accuracy, 
              completeness, or timeliness of information provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibend text-orange-400 mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, HODLearn shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages arising from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">10. Privacy</h2>
            <p className="mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
              use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">11. Changes to Terms</h2>
            <p className="mb-4">
              We may update these Terms from time to time. We will notify users of material changes via email 
              or prominent notice on our Service. Continued use after changes constitutes acceptance of updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">12. Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="mb-4">
              Email: legal@hodlearn.com<br />
              Address: [Your Business Address]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">13. Governing Law</h2>
            <p className="mb-4">
              These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], 
              without regard to conflict of law principles.
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