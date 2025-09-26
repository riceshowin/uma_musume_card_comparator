let supportCards = [];
let skillsData = [];

async function loadJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return await res.json();
}

function normalizeSkillName(name) {
    return name ? name.trim().toLowerCase() : "";
}

function getRarityBadge(title) {
    if (title.includes("SSR")) return '<span class="rarity-badge ssr-badge">SSR</span>';
    if (title.includes("SR")) return '<span class="rarity-badge sr-badge">SR</span>';
    return '';
}

// Display skills
function displaySkills(selectedTitle) {
    const container = document.getElementById("skillsContainer");
    container.innerHTML = "";

    const card = supportCards.find(c => c.title === selectedTitle);
    if (!card) return;

    card.skills.forEach(skillName => {
        const normalizedSkillName = normalizeSkillName(skillName);
        const skill = skillsData.find(s => normalizeSkillName(s.skill) === normalizedSkillName);

        if (skill) {
            const div = document.createElement("div");
            div.className = "skill-card";
            div.innerHTML = `
                <h3>${skill.skill} ${getRarityBadge(skill.skill)}</h3>
                <p><strong>Cost:</strong> ${skill.cost}</p>
                <p><strong>Trigger:</strong> ${skill.trigger}</p>
                <p><strong>Condition:</strong> ${skill.condition}</p>
                <p><strong>Duration:</strong> ${skill.duration}</p>
                <p><strong>Description:</strong> ${skill.description}</p>
                <p><strong>Effect:</strong> ${skill.effect}</p>
                <p><strong>Notes:</strong> ${skill.notes}</p>
                <p><strong>Verdict:</strong> ${skill.veredict}</p>
            `;
            container.appendChild(div);
        }
    });
}

// Populate dropdown
function updateDropdown(filter = "") {
    const list = document.getElementById("dropdownList");
    list.innerHTML = "";

    supportCards
        .filter(card => card.title.toLowerCase().startsWith(filter.toLowerCase()))
        .forEach(card => {
            const div = document.createElement("div");
            div.textContent = card.title;

            if (card.title.includes("SSR")) div.classList.add("ssr");
            else if (card.title.includes("SR")) div.classList.add("sr");

            div.addEventListener("click", () => {
                document.getElementById("cardInput").value = card.title;
                list.style.display = "none";
                displaySkills(card.title);
            });

            list.appendChild(div);
        });

    list.style.display = list.childElementCount > 0 ? "block" : "none";
}

async function init() {
    [supportCards, skillsData] = await Promise.all([
        loadJSON("support_cards_skills.json"),
        loadJSON("skills_output.json")
    ]);

    const input = document.getElementById("cardInput");

    // Show dropdown on focus
    input.addEventListener("focus", () => updateDropdown(input.value));

    // Filter dropdown as user types
    input.addEventListener("input", () => updateDropdown(input.value));

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown-container")) {
            document.getElementById("dropdownList").style.display = "none";
        }
    });
}

init();
