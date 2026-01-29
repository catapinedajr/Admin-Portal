import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200">
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
              <p className="text-sm text-zinc-400">Last updated: January 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-zinc prose-invert max-w-none">
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By creating an account and using HODLearn ("Service"), you agree to be bound by these Terms of Service ("Terms") 
              and our Privacy Policy. If you do not agree to these Terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">2. Eligibility</h2>
            <p className="mb-4">
              You must be at least 13 years old to use HODLearn. By using our Service, you represent that you meet this 
              age requirement and have the legal capacity to enter into these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">3. Description of Service</h2>
            <p className="mb-4">
              HODLearn is an educational platform focused on Bitcoin education. We provide:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Daily Bitcoin educational content and lessons</li>
              <li>Interactive quizzes and progress tracking</li>
              <li>Community forums for discussion and learning</li>
              <li>Educational simulators and practice tools</li>
              <li>Curated educational resources</li>
              <li>A gamified rewards system (HODLearn Points)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">4. Educational Purpose Only — Important Disclaimer</h2>
            <p className="mb-4">
              <strong>HODLearn provides educational content for informational purposes only.</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We do NOT provide financial, investment, tax, or legal advice</li>
              <li>We are NOT financial advisors or licensed professionals</li>
              <li>All content is for educational and informational purposes only</li>
              <li>Past performance of Bitcoin is not indicative of future results</li>
              <li>Cryptocurrency involves substantial risk — values can be extremely volatile</li>
              <li>You should never invest more than you can afford to lose</li>
            </ul>
            <p className="mb-4">
              <strong>Always do your own research and consult qualified professionals before making any financial decisions.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">5. HODLearn Points</h2>
            <p className="mb-4">
              HODLearn Points are virtual rewards earned through learning activities within the app.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong>HODLearn Points are NOT real Bitcoin, cryptocurrency, or money</strong></li>
              <li>They have no cash value and cannot be exchanged for real currency</li>
              <li>Points are for educational and gamification purposes only</li>
              <li>Points may be modified, reset, or discontinued at our discretion</li>
              <li>Points are non-transferable between accounts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">6. User Accounts and Registration</h2>
            <p className="mb-4">To use our Service, you must:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Keep your information current and updated</li>
              <li>Maintain the security and confidentiality of your account credentials</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">7. Community Guidelines</h2>
            <p className="mb-4">When participating in our community forums, you agree NOT to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Post spam, promotional content, or off-topic material</li>
              <li>Share personal financial advice or promote specific investments</li>
              <li>Engage in harassment, discrimination, hate speech, or abusive behavior</li>
              <li>Impersonate others or spread misinformation</li>
              <li>Violate others' privacy or intellectual property rights</li>
              <li>Post illegal content or encourage illegal activities</li>
            </ul>
            <p className="mb-4">
              We reserve the right to remove content and suspend, mute, or permanently ban users who violate these guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">8. Subscriptions and Payments</h2>
            <p className="mb-4">Some features of HODLearn require a paid subscription:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>By subscribing, you authorize us to charge your payment method on a recurring basis</li>
              <li>Subscription fees are billed in advance on a monthly or annual basis</li>
              <li>You can cancel your subscription at any time through your account settings</li>
              <li>Refunds are handled according to App Store/Google Play policies for mobile purchases</li>
              <li>For web subscriptions, refunds are considered on a case-by-case basis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">9. Intellectual Property</h2>
            <p className="mb-4">
              HODLearn owns or licenses all content, trademarks, and intellectual property on the Service, including 
              lessons, quizzes, graphics, simulators, and educational materials.
            </p>
            <p className="mb-4">
              You may use our content for personal, educational purposes but may NOT reproduce, distribute, 
              modify, or create derivative works without our written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">10. Prohibited Uses</h2>
            <p className="mb-4">You may NOT use our Service to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate others or provide false information</li>
              <li>Distribute malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape or download content</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">11. Account Termination</h2>
            <p className="mb-4">
              We reserve the right to suspend or terminate your account at any time, with or without notice, for:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Violations of these Terms or Community Guidelines</li>
              <li>Fraudulent or illegal activity</li>
              <li>Any other reason at our sole discretion</li>
            </ul>
            <p className="mb-4">
              You may delete your account at any time through your account settings or by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">12. Disclaimer of Warranties</h2>
            <p className="mb-4">
              HODLearn is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. 
              We do not guarantee that the Service will be uninterrupted, error-free, or completely secure.
            </p>
            <p className="mb-4">
              We do not guarantee the accuracy, completeness, or timeliness of educational content provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">13. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, HODLearn and its founders, employees, and affiliates shall NOT be 
              liable for any indirect, incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Your use of or inability to use the Service</li>
              <li>Any financial decisions you make based on our educational content</li>
              <li>Unauthorized access to your account or data</li>
              <li>Any third-party content or services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">14. Changes to Terms</h2>
            <p className="mb-4">
              We may update these Terms from time to time. We will notify users of material changes via email 
              or prominent notice on our Service. Continued use after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">15. Governing Law</h2>
            <p className="mb-4">
              These Terms are governed by and construed in accordance with the laws of the State of Florida, United States, 
              without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-orange-400 mb-4">16. Contact Information</h2>
            <p className="mb-4">
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="mb-4">
              Email: <a href="mailto:info@hodlearn.io" className="text-orange-400 hover:underline">info@hodlearn.io</a>
            </p>
          </section>

        </div>

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
