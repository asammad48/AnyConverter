(function() {
  'use strict';

  function generate() {
    var company = document.getElementById('pp-company').value.trim() || 'Your Company';
    var website = document.getElementById('pp-website').value.trim() || 'https://yourwebsite.com';
    var email   = document.getElementById('pp-email').value.trim() || 'privacy@yourwebsite.com';
    var country = document.getElementById('pp-country').value || 'the applicable jurisdiction';
    var analytics = document.getElementById('pp-analytics').checked;
    var cookies  = document.getElementById('pp-cookies').checked;
    var thirdParty = document.getElementById('pp-thirdparty').checked;
    var today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

    var policy = 'Privacy Policy\n\nLast updated: ' + today + '\n\n' +
      '1. Introduction\n\n' +
      company + ' ("we", "us", or "our") operates ' + website + ' (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.\n\n' +

      '2. Information We Collect\n\n' +
      'We may collect the following types of information:\n\n' +
      '- Personal Identification Information: Name, email address, and other details you voluntarily provide.\n' +
      '- Usage Data: Information on how the Service is accessed and used, including IP address, browser type, pages visited, and time spent.\n' +
      (analytics ? '- Analytics Data: We use analytics tools to understand how visitors use our site.\n' : '') +
      (cookies   ? '- Cookies: We use cookies and similar tracking technologies to track activity on our Service.\n' : '') +
      '\n' +

      '3. How We Use Your Information\n\n' +
      'We use the collected information for the following purposes:\n\n' +
      '- To provide and maintain our Service\n' +
      '- To notify you about changes to our Service\n' +
      '- To provide customer support\n' +
      '- To monitor usage of our Service\n' +
      '- To detect, prevent, and address technical issues\n\n' +

      (thirdParty ?
      '4. Third-Party Services\n\n' +
      'We may employ third-party companies and individuals to facilitate our Service, provide the Service on our behalf, perform Service-related services, or assist us in analysing how our Service is used. These third parties have access to your Personal Data only to perform these tasks and are obligated not to disclose or use it for any other purpose.\n\n' : '') +

      (analytics ?
      '5. Analytics\n\n' +
      'We may use third-party Service Providers to monitor and analyse the use of our Service. Analytics providers may collect information about your use of the Service and other websites over time.\n\n' : '') +

      (cookies ?
      '6. Cookies\n\n' +
      'Cookies are files with a small amount of data, which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.\n\n' : '') +

      '7. Data Security\n\n' +
      'The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.\n\n' +

      '8. Your Rights\n\n' +
      'Depending on your location, you may have the following rights regarding your personal data:\n\n' +
      '- The right to access, update, or delete your personal information\n' +
      '- The right to object to processing of your personal data\n' +
      '- The right to data portability\n' +
      '- The right to withdraw consent\n\n' +

      '9. Children\'s Privacy\n\n' +
      'Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.\n\n' +

      '10. Changes to This Privacy Policy\n\n' +
      'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.\n\n' +

      '11. Contact Us\n\n' +
      'If you have any questions about this Privacy Policy, please contact us:\n' +
      '- Email: ' + email + '\n' +
      '- Website: ' + website + '\n' +
      '- Governing Law: ' + country;

    document.getElementById('pp-output').value = policy;
    document.getElementById('pp-result-wrap').style.display = 'block';
  }

  function copyPolicy() {
    var el = document.getElementById('pp-output');
    el.select();
    document.execCommand('copy');
    var btn = document.getElementById('pp-copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pp-generate-btn').addEventListener('click', generate);
    document.getElementById('pp-copy-btn').addEventListener('click', copyPolicy);
  });
})();
