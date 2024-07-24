document.addEventListener('DOMContentLoaded', () => {
    const testimonialsCarousel = document.getElementById('testimonials-carousel');

    Promise.all([
        axios.get('https://jsonplaceholder.typicode.com/posts'),
        axios.get('https://jsonplaceholder.typicode.com/users')
    ])
        .then(responses => {
            const [posts, users] = responses.map(response => response.data);

            const postsByUser = posts.reduce((acc, post) => {
                if (!acc[post.userId]) acc[post.userId] = post;
                return acc;
            }, {});

            const promises = Object.keys(postsByUser).map((userId, index) => {
                const user = users.find(user => user.id === parseInt(userId));
                const post = postsByUser[userId];

                const postContentHTML = `
                <h6>${post.title}</h6>
                <div><p>${post.body}</p></div>
            `;

                return checkImageExists(index)
                    .then(() => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <div class="d-flex flex-column align-items-center">
                            <img src="assets/images/person_${index}.jpg" alt="User" class="rounded-circle me-3" style="width: 50px; height: 50px;">
                            <div class="comment-box text-center p-3 border rounded">
                                <div class="d-flex align-items-center mb-3">
                                    <div>
                                        <h5 class="title-style">${user.name}</h5>
                                        <p class="mb-1">${postContentHTML}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
                    .catch(() => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                        <div class="d-flex flex-column align-items-center">                            
                            <div class="comment-box text-center p-3 border rounded">
                                <div class="d-flex align-items-center mb-3">
                                    <div>
                                        <h5 class="title-style">${user.name}</h5>
                                        <p class="mb-1">${postContentHTML}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            });
            Promise.all(promises)
                .then(testimonials => {
                    testimonialsCarousel.innerHTML = testimonials.join('');
                });
        })
        .catch(error => {
            console.error('Error fetching testimonials:', error);
        });
});

function checkImageExists(index) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = `assets/images/img_${index}.jpg`;
        img.onload = () => resolve();
        img.onerror = () => reject();
    });
}
