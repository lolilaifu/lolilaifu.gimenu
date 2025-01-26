// Initialize local storage if empty
if (!localStorage.getItem('characters')) {
  localStorage.setItem('characters', JSON.stringify([]));
}
if (!localStorage.getItem('teams')) {
  localStorage.setItem('teams', JSON.stringify([]));
}
if (!localStorage.getItem('weapons')) {
  localStorage.setItem('weapons', JSON.stringify([]));
}

// DOM Elements
const sections = {
  characters: document.getElementById('characters-section'),
  teams: document.getElementById('teams-section'),
  weapons: document.getElementById('weapons-section')
};

const modals = {
  character: document.getElementById('character-modal'),
  weapon: document.getElementById('weapon-modal')
};

// Navigation
document.querySelectorAll('nav button').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.id.replace('-tab', '');
    showSection(target);
  });
});

function showSection(section) {
  Object.values(sections).forEach(s => s.classList.remove('active'));
  sections[section].classList.add('active');
}

// Character Management
document.getElementById('add-character').addEventListener('click', () => {
  const name = prompt('Enter character name:');
  if (name) {
    const newCharacter = {
      id: Date.now(),
      name: name,
      image: null,
      stats: {
        atk: 0,
        def: 0,
        hp: 0,
        elementalMastery: 0,
        critRate: 0,
        critDmg: 0
      },
      constellation: 0,
      weapon: null
    };
    
    const characters = JSON.parse(localStorage.getItem('characters'));
    characters.push(newCharacter);
    localStorage.setItem('characters', JSON.stringify(characters));
    updateCharactersList();
  }
});

function updateCharactersList() {
  const characters = JSON.parse(localStorage.getItem('characters'));
  const list = document.querySelector('.characters-list');
  list.innerHTML = characters.map(char => `
    <div class="character-item">
      <div class="character-thumbnail-container">
        ${char.image ? `<img src="${char.image}" alt="${char.name}" class="character-thumbnail" onclick="document.getElementById('char-upload-${char.id}').click()">` : 
          `<div class="character-thumbnail" onclick="document.getElementById('char-upload-${char.id}').click()">+</div>`}
        <input type="file" id="char-upload-${char.id}" class="character-upload" accept="image/*" style="display: none;">
      </div>
      <span>${char.name}</span>
      <button onclick="showCharacterDetails(${char.id})">Details</button>
      <button onclick="removeCharacter(${char.id})">Remove</button>
    </div>
  `).join('');
  
  // Add image upload handlers
  characters.forEach(char => {
    const upload = document.getElementById(`char-upload-${char.id}`);
    if (upload) {
      upload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            char.image = event.target.result;
            localStorage.setItem('characters', JSON.stringify(characters));
            updateCharactersList();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });
}

// Team Management
document.getElementById('add-team').addEventListener('click', () => {
  const name = prompt('Enter team name:');
  if (name) {
    const newTeam = {
      id: Date.now(),
      name: name,
      members: []
    };
    
    const teams = JSON.parse(localStorage.getItem('teams'));
    teams.push(newTeam);
    localStorage.setItem('teams', JSON.stringify(teams));
    updateTeamsList();
  }
});

function updateTeamsList() {
  const teams = JSON.parse(localStorage.getItem('teams'));
  const list = document.querySelector('.teams-list');
  list.innerHTML = teams.map(team => `
    <div class="team-item">
      <span>${team.name}</span>
      <button onclick="editTeam(${team.id})">Edit</button>
      <button onclick="removeTeam(${team.id})">Remove</button>
    </div>
  `).join('');
}

// Weapon Management
document.getElementById('add-weapon').addEventListener('click', () => {
  const name = prompt('Enter weapon name:');
  if (name) {
    const newWeapon = {
      id: Date.now(),
      name: name,
      refinement: 1,
      level: 1,
      image: null
    };
    
    const weapons = JSON.parse(localStorage.getItem('weapons'));
    weapons.push(newWeapon);
    localStorage.setItem('weapons', JSON.stringify(weapons));
    updateWeaponsList();
  }
});

function updateWeaponsList() {
  const weapons = JSON.parse(localStorage.getItem('weapons'));
  const list = document.querySelector('.weapons-list');
  list.innerHTML = weapons.map(weapon => `
    <div class="weapon-item">
      <div class="weapon-thumbnail-container">
        ${weapon.image ? `<img src="${weapon.image}" alt="${weapon.name}" class="weapon-thumbnail" onclick="document.getElementById('weapon-upload-${weapon.id}').click()">` : 
          `<div class="weapon-thumbnail" onclick="document.getElementById('weapon-upload-${weapon.id}').click()">+</div>`}
        <input type="file" id="weapon-upload-${weapon.id}" class="weapon-upload" accept="image/*" style="display: none;">
      </div>
      <span>${weapon.name}</span>
      <button onclick="showWeaponDetails(${weapon.id})">Details</button>
      <button onclick="removeWeapon(${weapon.id})">Remove</button>
    </div>
  `).join('');
  
  // Add image upload handlers
  weapons.forEach(weapon => {
    const upload = document.getElementById(`weapon-upload-${weapon.id}`);
    if (upload) {
      upload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            weapon.image = event.target.result;
            localStorage.setItem('weapons', JSON.stringify(weapons));
            updateWeaponsList();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  });
}

// Character Details
function showCharacterDetails(id) {
  const characters = JSON.parse(localStorage.getItem('characters'));
  const character = characters.find(c => c.id === id);
  
  const modalContent = `
    <button class="close-top" onclick="modals.character.classList.remove('active')">×</button>
    <h3>${character.name}</h3>
    <div class="character-image-container">
      ${character.image ? `<img src="${character.image}" alt="${character.name}" class="character-image">` : ''}
      <input type="file" id="character-image-upload" accept="image/*">
    </div>
    <form id="character-stats-form">
      <label>ATK: <input type="number" name="atk" value="${character.stats.atk}"></label>
      <label>DEF: <input type="number" name="def" value="${character.stats.def}"></label>
      <label>HP: <input type="number" name="hp" value="${character.stats.hp}"></label>
      <label>Elemental Mastery: <input type="number" name="elementalMastery" value="${character.stats.elementalMastery}"></label>
      <label>Crit Rate: <input type="number" name="critRate" value="${character.stats.critRate}"></label>
      <label>Crit DMG: <input type="number" name="critDmg" value="${character.stats.critDmg}"></label>
      <label>Constellation: 
        <select name="constellation">
          ${Array.from({length: 7}, (_, i) => 
            `<option value="${i}" ${i === character.constellation ? 'selected' : ''}>${i}</option>`
          ).join('')}
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  `;
  
  modals.character.querySelector('.modal-content').innerHTML = modalContent;
  modals.character.classList.add('active');
  
  // Handle image upload
  document.getElementById('character-image-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        character.image = event.target.result;
        localStorage.setItem('characters', JSON.stringify(characters));
        showCharacterDetails(character.id); // Refresh to show new image
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('character-stats-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    character.stats.atk = Number(formData.get('atk'));
    character.stats.def = Number(formData.get('def'));
    character.stats.hp = Number(formData.get('hp'));
    character.stats.elementalMastery = Number(formData.get('elementalMastery'));
    character.stats.critRate = Number(formData.get('critRate'));
    character.stats.critDmg = Number(formData.get('critDmg'));
    character.constellation = Number(formData.get('constellation'));
    
    localStorage.setItem('characters', JSON.stringify(characters));
    updateCharactersList();
    modals.character.classList.remove('active');
  });
}

function removeCharacter(id) {
  if (confirm('Are you sure you want to remove this character?')) {
    let characters = JSON.parse(localStorage.getItem('characters'));
    characters = characters.filter(c => c.id !== id);
    localStorage.setItem('characters', JSON.stringify(characters));
    updateCharactersList();
  }
}

// Weapon Details
function showWeaponDetails(id) {
  const weapons = JSON.parse(localStorage.getItem('weapons'));
  const weapon = weapons.find(w => w.id === id);
  
  const modalContent = `
    <button class="close-top" onclick="modals.weapon.classList.remove('active')">×</button>
    <h3>${weapon.name}</h3>
    <div class="weapon-detail-image-container">
      ${weapon.image ? `<img src="${weapon.image}" alt="${weapon.name}" class="weapon-detail-image">` : ''}
      <input type="file" id="weapon-detail-image-upload" accept="image/*">
    </div>
    <form id="weapon-stats-form">
      <label>Refinement: 
        <select name="refinement">
          ${Array.from({length: 5}, (_, i) => 
            `<option value="${i + 1}" ${(i + 1) === weapon.refinement ? 'selected' : ''}>${i + 1}</option>`
          ).join('')}
        </select>
      </label>
      <label>Level: 
        <input type="number" name="level" min="1" max="90" value="${weapon.level}">
      </label>
      <button type="submit">Save</button>
    </form>
  `;
  
  modals.weapon.querySelector('.modal-content').innerHTML = modalContent;
  modals.weapon.classList.add('active');

  // Handle weapon image upload
  document.getElementById('weapon-detail-image-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        weapon.image = event.target.result;
        localStorage.setItem('weapons', JSON.stringify(weapons));
        showWeaponDetails(weapon.id); // Refresh to show new image
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.getElementById('weapon-stats-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    weapon.refinement = Number(formData.get('refinement'));
    weapon.level = Number(formData.get('level'));
    
    localStorage.setItem('weapons', JSON.stringify(weapons));
    updateWeaponsList();
    modals.weapon.classList.remove('active');
  });
}

function removeWeapon(id) {
  if (confirm('Are you sure you want to remove this weapon?')) {
    let weapons = JSON.parse(localStorage.getItem('weapons'));
    weapons = weapons.filter(w => w.id !== id);
    localStorage.setItem('weapons', JSON.stringify(weapons));
    updateWeaponsList();
  }
}

// Team Editing
function editTeam(id) {
  const teams = JSON.parse(localStorage.getItem('teams'));
  const team = teams.find(t => t.id === id);
  const characters = JSON.parse(localStorage.getItem('characters'));
  
  const modalContent = `
    <button class="close-top" onclick="modals.character.classList.remove('active')">×</button>
    <h3>Edit Team: ${team.name}</h3>
    <form id="team-edit-form">
      ${Array.from({length: 4}, (_, i) => `
        <label>Member ${i + 1}:
          <select name="member${i}">
            <option value="">None</option>
            ${characters.map(c => 
              `<option value="${c.id}" ${team.members[i] === c.id ? 'selected' : ''}>${c.name}</option>`
            ).join('')}
          </select>
        </label>
      `).join('')}
      <button type="submit">Save</button>
    </form>
  `;
  
  modals.character.querySelector('.modal-content').innerHTML = modalContent;
  modals.character.classList.add('active');
  
  document.getElementById('team-edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    team.members = [
      formData.get('member0'),
      formData.get('member1'),
      formData.get('member2'),
      formData.get('member3')
    ].filter(id => id);
    
    localStorage.setItem('teams', JSON.stringify(teams));
    updateTeamsList();
    modals.character.classList.remove('active');
  });
}

function removeTeam(id) {
  if (confirm('Are you sure you want to remove this team?')) {
    let teams = JSON.parse(localStorage.getItem('teams'));
    teams = teams.filter(t => t.id !== id);
    localStorage.setItem('teams', JSON.stringify(teams));
    updateTeamsList();
  }
}

// Modal Close Handlers
document.querySelectorAll('.close-modal').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
    });
  });
});

// Initialize UI
updateCharactersList();
updateTeamsList();
updateWeaponsList();
