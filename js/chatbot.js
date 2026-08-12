/* ══════════════════════════════════════════════════════════
   PORTFOLIO CHATBOT — rule-based, no external API calls.
   Answers are sourced directly from the page content below,
   so update this file whenever the Skills / Experience / Work
   sections on the page change.
══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", function () {

    /* ── Knowledge base ─────────────────────────────────── */
    const KNOWLEDGE_BASE = [
        {
            id: "skills",
            keywords: ["skill", "skills", "tech stack", "technology", "technologies", "tools", "proficient", "languages", "frameworks", "know", "expertise"],
            answer: "I work across the full design + development spectrum:\n\n\u2022 Design Strategy: Figma, Adobe XD, Wireframing, Prototyping, Design Systems, Typography, User Research\n\u2022 Frontend: HTML5/CSS3, JavaScript, Bootstrap, Tailwind CSS, jQuery, Responsive Design\n\u2022 Backend: PHP, MySQL, SEO, Performance Optimization, API Integration\n\u2022 AI Workflows: Prompt Engineering with Claude & Gemini to speed up delivery\n\nCheck the Skills section above for the full breakdown!"
        },
        {
            id: "experience",
            keywords: ["experience", "years", "worked", "career", "background", "job", "history", "roles", "companies", "company"],
            answer: "About 3.8+ years of professional experience:\n\n\u2022 Web Developer @ 7Seas Entertainment Ltd (May 2025 \u2013 May 2026) \u2014 solo full-stack ownership of a live gaming platform\n\u2022 Frontend Developer @ Innodigital Solutions (May 2024 \u2013 Oct 2024) \u2014 banking UI for tier-1 financial clients\n\u2022 Frontend Developer, Freelance (Jun 2023 \u2013 Apr 2024) \u2014 startup visual identity & frontend builds\n\u2022 UI Developer @ Saralam Technologies (Feb 2022 \u2013 Mar 2023) \u2014 enterprise web solutions\n\nSee the full timeline in the Experience section above."
        },
        {
            id: "projects",
            keywords: ["project", "projects", "portfolio", "case study", "case studies", "gaming", "ekyc", "kyc", "axis", "bank", "7seas"],
            answer: "Two flagship projects live on this site:\n\n\u2022 7Seas Gaming Platform \u2014 inherited an existing platform and fixed performance, responsiveness & UX issues end-to-end (Lighthouse score went from 60\u201370 to 90\u201395!)\n\u2022 eKYC Onboarding Portal \u2014 frontend work on a digital KYC flow for a tier-1 bank, focused on compliant, low-friction onboarding\n\nScroll up to the Work section to see both, including a full UI/UX case study for each."
        },
        {
            id: "education",
            keywords: ["education", "degree", "college", "university", "qualification", "study", "studied", "academic", "graduate", "cgpa", "school"],
            answer: "Here's my academic background:\n\n\u2022 Bachelor of Technology, Computer Science (2017\u20132021) \u2014 6.91 CGPA\n\u2022 Diploma in Mechanical Engineering \u2014 73.3%\n\u2022 SSC, Sharada High School (2015) \u2014 83%\n\nCheck the Education section above for the full timeline!"
        },
        {
            id: "resume",
            keywords: ["resume", "cv", "download"],
            answer: "You can download my resume anytime using the \"Download Resume\" button in the navbar or the Contact section!"
        },
        {
            id: "availability",
            keywords: ["available", "availability", "freelance", "hire", "hiring", "open to work", "job opening", "opportunity", "opportunities"],
            answer: "Yes \u2014 I'm currently open to full-time roles as well as freelance/contract work in Frontend Development and UI/UX Design. Feel free to reach out!"
        },
        {
            id: "contact",
            keywords: ["contact", "email", "phone", "number", "reach", "connect", "linkedin", "call"],
            answer: "You can reach me directly:\n\uD83D\uDCE7 bhaskar.kadle@example.com\n\uD83D\uDCDE +91 98765 43210\n\nOr scroll down to the Contact section and tap the buttons there."
        }
    ];

    const FALLBACK_ANSWER = "That's a great question \u2014 I don't have a ready answer for that one yet. You can reach Bhaskar directly at bhaskar.kadle@example.com and he'll get back to you personally.";
    const GREETING = "\uD83D\uDC4B Hi there! I'm Bhaskar's virtual assistant. Ask me about his skills, experience, projects, or how to get in touch \u2014 or tap a question below to get started.";

    const QUICK_REPLIES = [
        { label: "Skills", id: "skills" },
        { label: "Experience", id: "experience" },
        { label: "Projects", id: "projects" },
        { label: "Education", id: "education" },
        { label: "Contact", id: "contact" }
    ];

    /* ── DOM refs ────────────────────────────────────────── */
    const widget       = document.querySelector(".chatbot-widget");
    const toggleBtn     = document.getElementById("chatbot-toggle");
    const closeBtn       = document.getElementById("chatbot-close");
    const messagesEl     = document.getElementById("chatbot-messages");
    const quickRepliesEl = document.getElementById("chatbot-quick-replies");
    const formEl         = document.getElementById("chatbot-form");
    const inputEl        = document.getElementById("chatbot-input");

    if (!widget || !toggleBtn) return;

    let hasGreeted = false;

    /* ── Render helpers ──────────────────────────────────── */
    function addMessage(text, sender) {
        const bubble = document.createElement("div");
        bubble.className = "chatbot-msg " + sender;
        bubble.textContent = text;
        messagesEl.appendChild(bubble);
        scrollToBottom();
    }

    function showTyping() {
        const typing = document.createElement("div");
        typing.className = "chatbot-typing";
        typing.id = "chatbot-typing-indicator";
        typing.innerHTML = "<span></span><span></span><span></span>";
        messagesEl.appendChild(typing);
        scrollToBottom();
    }

    function hideTyping() {
        const typing = document.getElementById("chatbot-typing-indicator");
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function respond(text) {
        showTyping();
        const delay = 500 + Math.random() * 500;
        setTimeout(function () {
            hideTyping();
            addMessage(text, "bot");
        }, delay);
    }

    function renderQuickReplies() {
        quickRepliesEl.innerHTML = "";
        QUICK_REPLIES.forEach(function (item) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chatbot-chip";
            chip.textContent = item.label;
            chip.addEventListener("click", function () {
                addMessage(item.label, "user");
                const topic = KNOWLEDGE_BASE.find(function (t) { return t.id === item.id; });
                respond(topic ? topic.answer : FALLBACK_ANSWER);
            });
            quickRepliesEl.appendChild(chip);
        });
    }

    /* ── Keyword matching for free-text input ───────────── */
    function findBestMatch(userText) {
        const lower = userText.toLowerCase();
        let bestTopic = null;
        let bestScore = 0;

        KNOWLEDGE_BASE.forEach(function (topic) {
            let score = 0;
            topic.keywords.forEach(function (keyword) {
                if (lower.indexOf(keyword) !== -1) score += 1;
            });
            if (score > bestScore) {
                bestScore = score;
                bestTopic = topic;
            }
        });

        return bestTopic ? bestTopic.answer : FALLBACK_ANSWER;
    }

    /* ── Open / close panel ──────────────────────────────── */
    function openChat() {
        widget.classList.add("chatbot-open");
        if (!hasGreeted) {
            hasGreeted = true;
            respond(GREETING);
            renderQuickReplies();
        }
        setTimeout(function () { inputEl.focus(); }, 300);
    }

    function closeChat() {
        widget.classList.remove("chatbot-open");
    }

    toggleBtn.addEventListener("click", function () {
        widget.classList.contains("chatbot-open") ? closeChat() : openChat();
    });
    closeBtn.addEventListener("click", closeChat);

    /* ── Free-text submit ────────────────────────────────── */
    formEl.addEventListener("submit", function (e) {
        e.preventDefault();
        const text = inputEl.value.trim();
        if (!text) return;
        addMessage(text, "user");
        inputEl.value = "";
        respond(findBestMatch(text));
    });

});