const files = { 
    home: ["README"],
    recipies: ["recipies"],
    dimentions: ["overworld", "end"],
    items: [
        "items/README",
        "items/copper",
        "items/enderite",
        "items/lifecrystals"
    ],
    mobs: ["mobs/README.md"],
    enchantments: [
        "enchantments/README",
        "enchantments/papers",
        "enchantments/books"
    ]
};

function generateNavbar(files) {
    const navbar = document.getElementById('navbar');
    
    for (const category in files) {
        const categoryFiles = files[category];
        
        if (categoryFiles.length === 1) {3.020
            const link = document.createElement('a');
            link.href = `/#/${categoryFiles[0]}`;
            link.textContent = category;
            navbar.appendChild(link);
        } else {
            const dropdown = document.createElement('div');
            dropdown.classList.add('dropdown');
            
            const dropdownButton = document.createElement('a');
            dropdownButton.href = `/#/${categoryFiles[0]}`;
            dropdownButton.textContent = category;
            dropdown.appendChild(dropdownButton);
            
            const dropdownContent = document.createElement('div');
            dropdownContent.classList.add('dropdown-content');
            
            categoryFiles.forEach(file => {
                if (!file.includes("README")) {
                    const dropdownLink = document.createElement('a');
                    dropdownLink.href = `/#/${file}`;
                    dropdownLink.textContent = file.split('/').pop().replace('.md', '');
                    dropdownContent.appendChild(dropdownLink);
                }
            });
            
            dropdown.appendChild(dropdownContent);
            navbar.appendChild(dropdown);
        }
    }
}

generateNavbar(files);
