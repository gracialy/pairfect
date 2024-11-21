export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Privacy Policy</title>
            <!-- Link to Tailwind CSS -->
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 text-gray-800 font-sans">
            <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
                <h1 class="text-3xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
                <p class="mb-4">
                    Effective Date: 21 Nov 2024
                </p>
                <p class="mb-4">
                    Pairfect (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you use our service to search for and access editing materials via Pinterest.
                </p>
                <h2 class="text-2xl font-bold mb-2 text-gray-900">1. Information We Collect</h2>
                <h3 class="text-xl font-semibold mb-2 text-gray-900">a. Information You Provide</h3>
                <p class="mb-4">
                    <strong>Pinterest Account Information:</strong> When you connect your Pinterest account to our service, we collect your authorization token to access Pinterest’s API on your behalf. This token is required to provide the service and is stored temporarily for session management purposes.
                </p>
                <p class="mb-4">
                    <strong>Search Queries and Preferences:</strong> Information about the materials you search for or the features you use within our service.
                </p>
                <h3 class="text-xl font-semibold mb-2 text-gray-900">b. Automatically Collected Information</h3>
                <p class="mb-4">
                    <strong>Usage Data:</strong> Information about how you use our service, such as session duration, feature interaction, and error reports, to improve the user experience.
                </p>
                <p class="mb-4">
                    <strong>Device Data:</strong> Information about the device you use to access our service (e.g., browser type, operating system).
                </p>
                <h2 class="text-2xl font-bold mb-2 text-gray-900">2. How We Use Your Information</h2>
                <p class="mb-4">
                    We use the information collected for the following purposes:
                </p>
                <ul class="list-disc list-inside mb-4">
                    <li>To provide and improve our service, including retrieving editing materials from Pinterest based on your searches.</li>
                    <li>To maintain and enhance the functionality of our application.</li>
                    <li>To comply with Pinterest’s guidelines and applicable laws.</li>
                </ul>
                <h2 class="text-2xl font-bold mb-2 text-gray-900">3. How We Share Your Information</h2>
                <p class="mb-4">
                    We do not share your information with third parties except:
                </p>
                <ul class="list-disc list-inside mb-4">
                    <li><strong>With Pinterest:</strong> To enable search functionality and retrieve relevant content through their API, as authorized by you.</li>
                    <li><strong>With You:</strong> To display results and personalized features within the application.</li>
                    <li><strong>As Required by Law:</strong> To comply with legal obligations or protect our rights and the rights of others.</li>
                </ul>
                <h2 class="text-2xl font-bold mb-2 text-gray-900">4. Data Storage and Security</h2>
                <p class="mb-4">
                    <strong>Temporary Data Storage:</strong> We do not store Pinterest account information or data retrieved from the Pinterest API on our servers beyond the current session, as required by Pinterest’s guidelines.
                </p>
                <p class="mb-4">
                    <strong>Access Credentials:</strong> Your API credentials are stored locally on your device and are not stored server-side.
                </p>
                <p class="mb-4">
                    <strong>Security Measures:</strong> We use encryption and industry-standard practices to protect your data.
                </p>
                <h2 class="text-2xl font-bold mb-2 text-gray-900">5. User Control and Consent</h2>
                <p class="mb-4">
                    <strong>Authorization:</strong> You must explicitly authorize our service to access your Pinterest account.
                </p>
                <p class="mb-4">
                    <strong>Revocation:</strong> You can revoke our access to your Pinterest account at any time through your Pinterest account settings.
                </p>
                <p class="mb-4">
                    <strong>Opt-Out:</strong> If you no longer wish to use our service, you may discontinue its use and remove your authorization.
                </p>
                <h2 class="text-2xl font-bold mb-2 text-gray-900">6. Compliance with Pinterest Guidelines</h2>
                <p class="mb-4">
                    Our service complies with Pinterest’s Developer and API Terms of Service, Community Guidelines, and other policies.
                </p>
                <ul class="list-disc list-inside mb-4">
                    <li>We do not store, sell, or share Pinterest user data with third parties.</li>
                    <li>We do not take any actions on your Pinterest account without your explicit consent.</li>
                    <li>We ensure that all content sourced from Pinterest is properly attributed and linked to its original source.</li>
                </ul>
                <h2 class="text-2xl font-bold mb-2 text-gray-900">7. Changes to This Privacy Policy</h2>
                <p class="mb-4">
                    We may update this Privacy Policy from time to time to reflect changes in our service or applicable laws. We will notify you of significant changes by posting the updated policy on our website or app. Please review this policy periodically.
                </p>
                <h2 class="text-2xl font-bold mb-2 text-gray-900">8. Contact Us</h2>
                <p class="mb-4">
                    If you have any questions about this Privacy Policy or our practices, please contact us at:
                </p>
                <p class="text-sm text-gray-600">
                    18222035@std.stei.itb.ac.id
                </p>
            </div>
        </body>
        </html>
    `);
}
