const imgSrc = [...document.querySelectorAll("img")]
    .map((img) => img.src)
    .filter((imgSrc) => imgSrc.includes("https"));

fetch("http://localhost:3000/images", {
    method: "post",
    body: JSON.stringify(imgSrc),
    headers: {
        "Content-Type": "application/json",
    },
});

fetch("http://localhost:3000/images").then((res) => console.log(res.json()));

// const container = document.createElement('div');
// imgSrc.forEach(src => {
// 	const img = document.createElement('img');
// 	img.src = src;
// 	container.appendChild(img);
// });
// const bodyElement = document.querySelector('body');
// bodyElement.innerHTML = ''
// bodyElement.appendChild(container);
