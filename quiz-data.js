const quizData = [
    {
        id: 1,
        attackId: 1,
        title: "Phishing Attack Quiz",
        description: "Test your knowledge about phishing attacks and how to defend against them.",
        questions: [
            {
                id: "p1",
                text: "What is the main goal of a phishing attack?",
                options: [
                    "To slow down a computer",
                    "To destroy files",
                    "To steal sensitive information",
                    "To test antivirus software"
                ],
                correctAnswer: 2,
                explanation: "Phishing attacks primarily aim to steal sensitive information like passwords, credit card details, or personal data by tricking users into revealing it."
            },
            {
                id: "p2",
                text: "Which of the following is a common sign of a phishing email?",
                options: [
                    "Fast internet speed",
                    "Personal greeting",
                    "Poor spelling and suspicious links",
                    "High-quality logo"
                ],
                correctAnswer: 2,
                explanation: "Phishing emails often contain poor grammar, spelling mistakes, and suspicious links that don't match the legitimate website's URL."
            },
            {
                id: "p3",
                text: "What should you do if you suspect an email is a phishing attempt?",
                options: [
                    "Click the link to see what happens",
                    "Forward it to friends",
                    "Delete it or report it to IT",
                    "Reply asking if it's legit"
                ],
                correctAnswer: 2,
                explanation: "The safest action is to delete the suspicious email or report it to your IT department. Never click links, download attachments, or respond to suspected phishing emails."
            },
            {
                id: "p4",
                text: "Phishing can occur through:",
                options: [
                    "Only websites",
                    "Only emails",
                    "Emails, texts, and calls",
                    "Only social media"
                ],
                correctAnswer: 2,
                explanation: "Phishing attacks can be delivered through multiple channels including emails, text messages (SMS), phone calls (voice phishing or 'vishing'), and social media platforms."
            },
            {
                id: "p5",
                text: "What tool helps prevent phishing?",
                options: [
                    "Disk cleaner",
                    "Email spam filter",
                    "Task manager",
                    "Screen saver"
                ],
                correctAnswer: 1,
                explanation: "Email spam filters help identify and block many phishing attempts before they reach your inbox, though they aren't perfect and should be combined with user vigilance."
            }
        ]
    },
    {
        id: 2,
        attackId: 2,
        title: "Man-in-the-Middle (MitM) Attack Quiz",
        description: "Test your knowledge about Man-in-the-Middle attacks and protection methods.",
        questions: [
            {
                id: "m1",
                text: "What does a Man-in-the-Middle attack do?",
                options: [
                    "Blocks user access",
                    "Encrypts files",
                    "Intercepts communication between two parties",
                    "Formats the disk"
                ],
                correctAnswer: 2,
                explanation: "A MitM attack involves an attacker secretly intercepting and potentially altering the communication between two parties who believe they're directly communicating with each other."
            },
            {
                id: "m2",
                text: "Where are MitM attacks most common?",
                options: [
                    "Home networks",
                    "Encrypted VPNs",
                    "Public Wi-Fi networks",
                    "Offline computers"
                ],
                correctAnswer: 2,
                explanation: "Public Wi-Fi networks are particularly vulnerable to MitM attacks because they often lack strong security, making it easier for attackers to intercept traffic."
            },
            {
                id: "m3",
                text: "Which method helps prevent MitM attacks?",
                options: [
                    "Using open networks",
                    "VPN and HTTPS",
                    "Sending unencrypted messages",
                    "Clearing cookies"
                ],
                correctAnswer: 1,
                explanation: "Using a VPN encrypts your traffic, while HTTPS ensures website connections are secure. Together, they significantly reduce the risk of MitM attacks."
            },
            {
                id: "m4",
                text: "What type of data is at risk in a MitM attack?",
                options: [
                    "Game scores",
                    "Login credentials",
                    "Sound settings",
                    "Wallpapers"
                ],
                correctAnswer: 1,
                explanation: "Login credentials, personal information, financial details, and other sensitive data transmitted during communication can be exposed in a MitM attack."
            },
            {
                id: "m5",
                text: "A MitM attacker can:",
                options: [
                    "Prevent device charging",
                    "Modify the messages between you and a website",
                    "Block USB ports",
                    "Turn off Wi-Fi only"
                ],
                correctAnswer: 1,
                explanation: "MitM attackers can not only view the communication but also modify the content, potentially changing the messages you send or receive to conduct fraud or manipulate information."
            }
        ]
    },
    {
        id: 3,
        attackId: 3,
        title: "Ransomware Quiz",
        description: "Test your knowledge about ransomware attacks and prevention strategies.",
        questions: [
            {
                id: "r1",
                text: "What does ransomware typically do to your files?",
                options: [
                    "Deletes them permanently",
                    "Encrypts them and demands payment",
                    "Uploads them to the cloud",
                    "Renames them only"
                ],
                correctAnswer: 1,
                explanation: "Ransomware encrypts your files, making them inaccessible, and then demands payment (usually in cryptocurrency) for the decryption key to restore access."
            },
            {
                id: "r2",
                text: "What's the safest way to recover files after a ransomware attack?",
                options: [
                    "Pay the ransom",
                    "Use a backup",
                    "Reboot the PC",
                    "Run Disk Cleanup"
                ],
                correctAnswer: 1,
                explanation: "Restoring from a recent backup is the safest and most reliable way to recover from a ransomware attack without paying the attackers."
            },
            {
                id: "r3",
                text: "What can help prevent ransomware infections?",
                options: [
                    "Unplugging keyboard",
                    "Regular data backups",
                    "Changing screen brightness",
                    "Using outdated software"
                ],
                correctAnswer: 1,
                explanation: "Regular backups, while not preventing infections, ensure you can recover without paying. Prevention includes updating software, using security software, and avoiding suspicious downloads."
            },
            {
                id: "r4",
                text: "A ransomware message usually demands:",
                options: [
                    "Game coins",
                    "Cryptocurrency payment",
                    "Likes on a post",
                    "Antivirus install"
                ],
                correctAnswer: 1,
                explanation: "Ransomware typically demands payment in cryptocurrency (like Bitcoin) because it's difficult to trace, making it the preferred payment method for cybercriminals."
            },
            {
                id: "r5",
                text: "Which behavior is suspicious and could lead to ransomware?",
                options: [
                    "Installing updates",
                    "Clicking unknown email attachments",
                    "Using password managers",
                    "Running backups"
                ],
                correctAnswer: 1,
                explanation: "Opening attachments from unknown or suspicious emails is a common way ransomware gets installed on systems. Always verify the sender and scan attachments before opening."
            }
        ]
    }
];

// Continue adding the remaining quizzes for attacks 4-10 following the same pattern

// Function to get a quiz by its ID
function getQuizById(quizId) {
    return quizData.find(quiz => quiz.id === parseInt(quizId));
}

// Function to get a quiz by attack ID
function getQuizByAttackId(attackId) {
    return quizData.find(quiz => quiz.attackId === parseInt(attackId));
}