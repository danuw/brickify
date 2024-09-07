document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
document.getElementById('cropButton').addEventListener('click', cropImage);
document.getElementById('resizeButton').addEventListener('click', resizeImage);
document.getElementById('pixelViewButton').addEventListener('click', showPixelView);
document.getElementById('inventoryButton').addEventListener('click', showColorInventory);

let originalImage = new Image();
let canvas = document.getElementById('imageCanvas');
let pixelCanvas = document.getElementById('pixelCanvas');
let ctx = canvas.getContext('2d');
let pixelCtx = pixelCanvas.getContext('2d');

const palette = [
    { name: "Dark Blue", color: [13, 43, 69] },
    { name: "Medium Blue", color: [32, 60, 86] },
    { name: "Dark Purple", color: [84, 78, 104] },
    { name: "Medium Purple", color: [141, 105, 122] },
    { name: "Dark Orange", color: [208, 129, 89] },
    { name: "Orange", color: [255, 170, 94] },
    { name: "Light Orange", color: [255, 212, 163] },
    { name: "Very Light Orange", color: [255, 236, 214] }
];

const palette2 = [
    { name: "Orange", color: [255, 165, 0] },
    { name: "White", color: [255, 255, 255] },
    { name: "Light light gray", color: [211, 211, 211] },
    { name: "Light gray", color: [169, 169, 169] },
    { name: "Dark Pink", color: [255, 20, 147] },
    { name: "Dark gray", color: [105, 105, 105] },
    { name: "Dark dark gray", color: [47, 79, 79] },
    { name: "Black", color: [0, 0, 0] },
    { name: "Light royal blue", color: [65, 105, 225] },
    { name: "Black gray", color: [112, 128, 144] },
    { name: "Skin white", color: [255, 228, 196] },
    { name: "Flesh Pink", color: [255, 182, 193] },
    { name: "Light Flesh", color: [255, 228, 225] },
    { name: "Flesh Tan", color: [255, 160, 122] },
    { name: "Flesh Red", color: [255, 99, 71] },
    { name: "Nougat", color: [205, 133, 63] },
    { name: "Reddish dark tan", color: [139, 69, 19] },
    { name: "Dark Orange", color: [255, 140, 0] },
    { name: "Bright Green", color: [0, 255, 0] },
    { name: "Dark Brown", color: [139, 69, 19] },
    { name: "Tan", color: [210, 180, 140] },
    { name: "Dark Tan", color: [139, 115, 85] },
    { name: "Bright light yellow", color: [255, 255, 224] },
    { name: "Yellow", color: [255, 255, 0] },
    { name: "Dark Orange", color: [255, 140, 0] },
    { name: "Bright light orange", color: [255, 165, 0] },
    { name: "Bright pink", color: [255, 105, 180] },
    { name: "Bright Pink", color: [255, 20, 147] },
    { name: "Magenta", color: [255, 0, 255] },
    { name: "Red", color: [255, 0, 0] },
    { name: "Dark Red", color: [139, 0, 0] },
    { name: "Sand red", color: [244, 164, 96] },
    { name: "Medium Lavender", color: [186, 85, 211] },
    { name: "Purple", color: [128, 0, 128] },
    { name: "Dark Purple", color: [75, 0, 130] },
    { name: "Medium Blue", color: [0, 0, 205] },
    { name: "Medium Azure", color: [0, 255, 255] },
    { name: "Navy Blue", color: [0, 0, 128] },
    { name: "Dark Azure", color: [0, 139, 139] },
    { name: "Bright light blue", color: [173, 216, 230] },
    { name: "Blue", color: [0, 0, 255] },
    { name: "Dark Blue", color: [0, 0, 139] },
    { name: "Sand Blue", color: [70, 130, 180] },
    { name: "Yellowish Green", color: [173, 255, 47] },
    { name: "Lime", color: [50, 205, 50] },
    { name: "Olive Green", color: [107, 142, 35] },
    { name: "Sand Green", color: [143, 188, 143] },
    { name: "Light Aqua", color: [224, 255, 255] },
    { name: "Brown", color: [165, 42, 42] },
    { name: "Green", color: [0, 128, 0] },
    { name: "Dark Green", color: [0, 100, 0] },
    { name: "Army Green", color: [75, 83, 32] }
];

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage.src = e.target.result;
            originalImage.onload = function() {
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                ctx.drawImage(originalImage, 0, 0);
                updateImageInfo(originalImage.width, originalImage.height);
            }
        }
        reader.readAsDataURL(file);
    }
}

function updateImageInfo(width, height) {
    document.getElementById('imageInfo').textContent = `Original Size: ${width} x ${height}`;
    document.getElementById('width').value = width;
    document.getElementById('height').value = height;
    document.getElementById('cropX').value = 0;
    document.getElementById('cropY').value = 0;
    document.getElementById('cropWidth').value = width;
    document.getElementById('cropHeight').value = height;
}

function cropImage() {
    const cropX = parseInt(document.getElementById('cropX').value);
    const cropY = parseInt(document.getElementById('cropY').value);
    const cropWidth = parseInt(document.getElementById('cropWidth').value);
    const cropHeight = parseInt(document.getElementById('cropHeight').value);

    if (cropWidth > 0 && cropHeight > 0) {
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        ctx.drawImage(originalImage, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    }
}

function resizeImage() {
    const newWidth = parseInt(document.getElementById('width').value);
    const newHeight = parseInt(document.getElementById('height').value);
    if (newWidth > 0 && newHeight > 0) {
        const croppedImage = new Image();
        croppedImage.src = canvas.toDataURL();
        croppedImage.onload = function() {
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(croppedImage, 0, 0, newWidth, newHeight);
        }
    }
}

function showPixelView() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const dotSize = 5;

    pixelCanvas.width = canvas.width * dotSize;
    pixelCanvas.height = canvas.height * dotSize;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            let r = data[index];
            let g = data[index + 1];
            let b = data[index + 2];
            const a = data[index + 3] / 255;

            // Apply simple color correction
            [r, g, b] = colorCorrection(r, g, b);

            //const [closestR, closestG, closestB] = findClosestColor(r, g, b);
            const { name, color: [closestR, closestG, closestB] } = findClosestColor(r, g, b);
            const color = `rgba(${closestR},${closestG},${closestB},${a})`;

            pixelCtx.fillStyle = `rgba(${closestR},${closestG},${closestB},${a})`;
            pixelCtx.beginPath();
            pixelCtx.arc(x * dotSize + dotSize / 2, y * dotSize + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
            pixelCtx.fill();
        }
    }
}

function colorCorrection(r, g, b) {
    // Increase contrast by scaling the color values
    const factor = 1.2;
    r = Math.min(255, r * factor);
    g = Math.min(255, g * factor);
    b = Math.min(255, b * factor);
    return [r, g, b];
}

function findClosestColor(r, g, b) {
    let minDistance = Infinity;
    let closestColor = { name: "", color: [0, 0, 0] };

    for (const { name, color: [pr, pg, pb] } of palette) {
        const distance = Math.sqrt(
            Math.pow(r - pr, 2) +
            Math.pow(g - pg, 2) +
            Math.pow(b - pb, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = { name, color: [pr, pg, pb] };
        }
    }

    return closestColor;
}

function showColorInventory() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const colorCount = {};

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            let r = data[index];
            let g = data[index + 1];
            let b = data[index + 2];
            const a = data[index + 3];
            
            // Apply simple color correction
            [r, g, b] = colorCorrection(r, g, b);

            const { name, color: [closestR, closestG, closestB] } = findClosestColor(r, g, b);
            const color = `rgba(${closestR},${closestG},${closestB},${a})`;

            if (colorCount[name]) {
                colorCount[name]++;
            } else {
                colorCount[name] = 1;
            }
        }
    }

    const colorInventoryDiv = document.getElementById('colorInventory');
    colorInventoryDiv.innerHTML = '';

    const colorList = Object.keys(colorCount).map(name => {
        const colorObj = palette.find(c => c.name === name);
        const colorValue = colorObj ? `rgb(${colorObj.color.join(',')})` : 'rgb(0, 0, 0)'; // Default to black if not found
        return `
            <li style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 20px; height: 20px; background-color: ${colorValue}; margin-right: 10px; border: 1px solid #ccc;"></div>
                ${name}: ${colorCount[name]} pixels
            </li>`;
    }).join('');

    colorInventoryDiv.innerHTML = `
        <h2>Color Inventory</h2>
        <ul>${colorList}</ul>
        <p>Total different colors: ${Object.keys(colorCount).length}</p>
    `;
}