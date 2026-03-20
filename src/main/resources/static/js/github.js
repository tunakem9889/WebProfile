async function fetchRepos() {
    const username = 'tunakem9889';
    const container = document.getElementById('github-projects');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=6`);
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        const repos = await response.json();
        container.innerHTML = ''; // Clear loading/static content

        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'glass project-card animate-in';
            
            card.innerHTML = `
                <div class="repo-header">
                    <h3>${repo.name}</h3>
                    <div class="repo-stars">
                        <i class="fas fa-star" style="color: #ffcd34;"></i> ${repo.stargazers_count}
                    </div>
                </div>
                <p>${repo.description || 'No description provided.'}</p>
                <div class="repo-footer">
                    <span class="repo-lang"><i class="fas fa-circle" style="color: ${getLangColor(repo.language)}"></i> ${repo.language || 'Plain Text'}</span>
                    <a href="${repo.html_url}" target="_blank" class="repo-link"><i class="fab fa-github"></i> View</a>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching repos:', error);
        container.innerHTML = '<p style="color: #ff4d4d;">Failed to load projects. Please check back later.</p>';
    }
}

function getLangColor(lang) {
    const colors = {
        'Java': '#b07219',
        'C++': '#f34b7d',
        'Python': '#3572A5',
        'Dart': '#00B4AB',
        'JavaScript': '#f1e05a',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'TypeScript': '#2b7489',
        'C#': '#178600'
    };
    return colors[lang] || '#888';
}

document.addEventListener('DOMContentLoaded', fetchRepos);
