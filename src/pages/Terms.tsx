import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian-800 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-obsidian-800/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Logo size="sm" variant="light" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-lavender/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-lavender" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p className="text-white/60">Last Updated: December 31, 2025</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-cyan max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">1. Agreement to Terms</h2>
              <p className="text-white/80 leading-relaxed">
                These Terms of Service ("Terms") constitute a legally binding agreement between you and Haro LLC ("Company," "we," "us," or "our"), governing your access to and use of the M.E. Truth website (metruth.com) and the Momentous Year mobile application (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">2. Eligibility</h2>
              <p className="text-white/80 leading-relaxed">
                You must be at least 13 years of age to use the Services. If you are under 18, you represent that you have your parent or guardian's permission to use the Services. By using the Services, you represent and warrant that you meet these eligibility requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">3. Description of Services</h2>
              <p className="text-white/80 leading-relaxed">
                M.E. Truth and the Momentous Year app provide goal-setting, mindfulness, and self-care tools designed to support personal development through the Science of Mindful Evolution. Features include goal management, habit tracking, journaling, meditation tools, AI-assisted life coaching, and life domain organization. User data may be stored locally on your device and/or synchronized through cloud services as described in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">4. License and Restrictions</h2>
              
              <h3 className="text-lg font-medium text-white mb-2">4.1 License Grant</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your personal, non-commercial purposes.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">4.2 Restrictions</h3>
              <p className="text-white/80 leading-relaxed">
                You agree not to: (a) copy, modify, or distribute the Services; (b) reverse engineer, decompile, or disassemble any portion of the Services; (c) rent, lease, lend, sell, or sublicense the Services; (d) use the Services for any unlawful purpose; (e) remove any proprietary notices from the Services; (f) use the Services in any manner that could damage, disable, or impair the Services; or (g) attempt to gain unauthorized access to any portion of the Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">5. Subscriptions and Payments</h2>
              
              <h3 className="text-lg font-medium text-white mb-2">5.1 Subscription Plans</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                The Services may offer subscription plans including monthly, annual, and lifetime access options. Prices are subject to change with notice to users.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">5.2 Billing</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                Payments are processed through Apple's App Store or Google Play Store, as applicable. Subscriptions automatically renew unless canceled at least 24 hours before the end of the current billing period. You can manage and cancel subscriptions through your Apple ID or Google account settings.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">5.3 Refunds</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                All purchases are subject to the refund policies of Apple or Google, as applicable. Refund requests must be submitted directly through the respective platform's standard refund process.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">5.4 Free Trial</h3>
              <p className="text-white/80 leading-relaxed">
                We may offer a free trial period. At the end of the trial, you will be automatically charged for the subscription unless you cancel before the trial ends.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">6. User Responsibilities</h2>
              <p className="text-white/80 leading-relaxed">
                You are solely responsible for: (a) maintaining the security of your account credentials and any passcode or biometric authentication protecting your device; (b) all data you enter into the Services; (c) backing up your data regularly; (d) ensuring the accuracy of information you provide; and (e) your use of any AI-assisted features, understanding that AI suggestions are for informational purposes only and do not constitute professional advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">7. Intellectual Property</h2>
              
              <h3 className="text-lg font-medium text-white mb-2">7.1 Ownership</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                The Services, including all content, features, functionality, text, design, graphics, logos, icons, and the "M.E. Truth," "Momentous Year," and "Mindful Evolution" trademarks, are owned by Haro LLC and are protected by United States and international copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">7.2 User Content</h3>
              <p className="text-white/80 leading-relaxed">
                You retain ownership of content you create within the Services. By using the Services, you grant us a limited license to process your content solely to provide the Services to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">8. Disclaimers</h2>
              <p className="text-white/80 leading-relaxed mb-4 uppercase text-sm">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
              </p>
              <p className="text-white/80 leading-relaxed mb-4">
                We do not warrant that: (a) the Services will be uninterrupted, secure, or error-free; (b) defects will be corrected; (c) the Services are free of viruses or harmful components; or (d) the results of using the Services will meet your requirements.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-200">
                <p className="font-medium mb-2">IMPORTANT:</p>
                <p className="text-sm">
                  The Services provide tools for personal development, goal-setting, mindfulness, and self-care for informational and organizational purposes only. The Services do not provide medical, psychological, legal, financial, or other professional advice. Information regarding mental health, wellness, or other topics should not be relied upon as a substitute for professional advice. Always consult qualified professionals for specific guidance.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">9. Limitation of Liability</h2>
              <p className="text-white/80 leading-relaxed mb-4 text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL HARO LLC, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICES.
              </p>
              <p className="text-white/80 leading-relaxed">
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICES EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR FIFTY DOLLARS ($50.00), WHICHEVER IS GREATER.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">10. Indemnification</h2>
              <p className="text-white/80 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Haro LLC and its officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from: (a) your use of the Services; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) any content you submit or transmit through the Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">11. Dispute Resolution and Arbitration</h2>
              
              <h3 className="text-lg font-medium text-white mb-2">11.1 Informal Resolution</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                Before filing any formal dispute, you agree to first contact us at support@metruth.com to attempt to resolve the dispute informally. We will attempt to resolve the dispute within 30 days.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">11.2 Binding Arbitration</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                If we cannot resolve a dispute informally, any controversy or claim arising out of or relating to these Terms or the Services shall be settled by binding arbitration administered by the American Arbitration Association in accordance with its Consumer Arbitration Rules. The arbitration shall be conducted in Broward County, Florida, unless you and we agree otherwise.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">11.3 Class Action Waiver</h3>
              <p className="text-white/80 leading-relaxed font-medium">
                YOU AND HARO LLC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">12. Governing Law</h2>
              <p className="text-white/80 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. For any disputes not subject to arbitration, you consent to the exclusive jurisdiction of the state and federal courts located in Broward County, Florida.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">13. Changes to Terms</h2>
              <p className="text-white/80 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you by posting the revised Terms on our website at metruth.com. Your continued use of the Services after such changes constitutes acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">14. Termination</h2>
              <p className="text-white/80 leading-relaxed">
                You may terminate this agreement at any time by deleting the app from your device, closing your account, and discontinuing use. We may terminate or modify the Services or your access to them at any time. Upon termination, your license to use the Services will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">15. Severability</h2>
              <p className="text-white/80 leading-relaxed">
                If any provision of these Terms is held to be unenforceable or invalid, such provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">16. Entire Agreement</h2>
              <p className="text-white/80 leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and Haro LLC regarding your use of the Services and supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">17. Contact Information</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-white/5 rounded-xl p-4 text-white/80">
                <p className="font-medium text-white">Haro LLC</p>
                <p>151 N. Nob Hill Road, STE 319</p>
                <p>Fort Lauderdale, FL 33324</p>
                <p className="mt-2">
                  Email: <a href="mailto:support@metruth.com" className="text-cyan hover:underline">support@metruth.com</a>
                </p>
                <p>
                  Website: <a href="https://metruth.com" className="text-cyan hover:underline">https://metruth.com</a>
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Terms;
