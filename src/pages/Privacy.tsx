import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const Privacy = () => {
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
            <div className="w-12 h-12 rounded-xl bg-cyan/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-white/60">Last Updated: December 31, 2025</p>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-cyan max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">1. Introduction</h2>
              <p className="text-white/80 leading-relaxed">
                Welcome to M.E. Truth and the Momentous Year app ("Services"). This Privacy Policy explains how Haro LLC ("Company," "we," "us," or "our") collects, uses, and protects information when you use our Services. By using the Services, you agree to the terms of this Privacy Policy.
              </p>
              <p className="text-white/80 leading-relaxed">
                We are committed to protecting your privacy. Our Services were designed with privacy as a core principle—your personal data remains under your control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-white mb-2">2.1 Information You Provide</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                When you use our Services, you may provide information including: account registration details (email address, username), goals, habits, and personal development data you enter, journal entries and reflections, preferences and settings, and any other content you choose to create within the Services.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">2.2 Authentication Data</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                The Services use Firebase Authentication for account creation and login purposes. The data collected via Firebase includes: your email address (used to manage your login credentials) and authentication tokens (used to verify your identity). Your email is not linked to your personal content within the app. We do not collect, store, or have access to your password.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">2.3 Data Storage</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                Depending on your settings, your data may be stored locally on your device using localStorage and/or synchronized to our cloud database (Firebase Firestore). You have control over whether to use cloud synchronization features.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">2.4 AI Assistant Data</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                If you use our AI assistant feature, your queries and relevant context may be processed through Google's Gemini AI service to provide personalized guidance. This data is processed in real-time and is subject to Google's privacy practices.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">2.5 Information We Do NOT Collect</h3>
              <p className="text-white/80 leading-relaxed">
                We do not collect: precise location data, device identifiers for advertising purposes, contacts or photos (unless you explicitly add them), health data from device sensors, or browsing history outside our Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">3. How We Use Your Information</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                We use your information to: provide and maintain the Services, enable features such as goal tracking, journaling, and habit monitoring, personalize your experience within the Services, process AI assistant queries to provide guidance, authenticate your account and maintain security, communicate with you about the Services, and improve and develop new features.
              </p>
              <p className="text-white/80 leading-relaxed font-medium">
                We do not sell, rent, or share your personal information with third parties for marketing purposes. We do not use your data for advertising.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">4. Data Security</h2>
              
              <h3 className="text-lg font-medium text-white mb-2">4.1 Security Measures</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your data, including encryption in transit and at rest, secure authentication through Firebase, and regular security assessments.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">4.2 Local Storage Security</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                Data stored locally on your device is protected by your device's built-in security features. We recommend enabling device-level security such as a passcode, Face ID, or Touch ID.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">4.3 Third-Party Security</h3>
              <p className="text-white/80 leading-relaxed">
                Firebase Authentication and Firestore are provided by Google and maintain industry-standard security practices. For more information, see Google's Firebase Privacy and Security documentation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">5. Your Rights and Choices</h2>
              
              <h3 className="text-lg font-medium text-white mb-2">5.1 Control Over Your Data</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                You have full control over your personal data within the Services. You can view, update, or delete any content at any time through the app's interface.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">5.2 Data Deletion</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                To delete your data, you can: delete individual entries within the app, use any "clear data" features within the app, or uninstall the app (which will remove locally stored data). To delete your account and all associated data, use the Delete Account feature in Settings or contact us at support@metruth.com with the subject line "Account Deletion Request." We will process your request within 30 days.
              </p>

              <h3 className="text-lg font-medium text-white mb-2">5.3 Data Export</h3>
              <p className="text-white/80 leading-relaxed">
                The Services may provide data export features to allow you to download your data. Check the app settings for available export options.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">6. Children's Privacy</h2>
              <p className="text-white/80 leading-relaxed">
                The Services are not intended for children under 13 years of age. Users must be at least 13 years old to create an account. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">7. Third-Party Services</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                The Services use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 mb-4">
                <li><strong>Firebase (Google):</strong> Used for user authentication and data storage. Firebase's privacy policy is available at https://firebase.google.com/support/privacy</li>
                <li><strong>Google Gemini AI:</strong> Used for AI assistant features. Subject to Google's privacy practices.</li>
              </ul>
              <p className="text-white/80 leading-relaxed">
                We do not use advertising SDKs or analytics platforms that track user behavior for advertising purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">8. California Privacy Rights (CCPA)</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                If you are a California resident, you have certain rights under the California Consumer Privacy Act (CCPA), including:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2 mb-4">
                <li>The right to know what personal information we collect and how it is used</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to opt-out of the sale of your personal information (note: we do not sell personal information)</li>
                <li>The right to non-discrimination for exercising your privacy rights</li>
              </ul>
              <p className="text-white/80 leading-relaxed">
                To exercise these rights, contact us at support@metruth.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">9. International Users</h2>
              <p className="text-white/80 leading-relaxed">
                If you are accessing the Services from outside the United States, please be aware that your information may be transferred to and processed in the United States where our servers are located. By using the Services, you consent to this transfer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-white/80 leading-relaxed">
                We may update this Privacy Policy from time to time. If we make significant changes, we will update the "Last Updated" date at the top of this policy and post the revised policy on our website at metruth.com. Your continued use of the Services after any changes constitutes acceptance of the updated Privacy Policy. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">11. Legal Disclaimer</h2>
              <p className="text-white/80 leading-relaxed">
                This Privacy Policy is provided for informational purposes. The Services and Haro LLC are not responsible for any loss or damages resulting from your use of the Services. This does not constitute legal advice. If you have questions about data privacy laws applicable to you, please consult qualified legal counsel.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan mb-4">12. Contact Us</h2>
              <p className="text-white/80 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
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

export default Privacy;
