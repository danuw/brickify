window.onload = function () {
    // Set up the canvases and contexts
    const inputCanvas = document.getElementById('inputCanvas');
    const inputCtx = inputCanvas.getContext('2d');
  
    const outputCanvas = document.getElementById('outputCanvas');
    const outputCtx = outputCanvas.getContext('2d');
  
    // Load the image
    const image = new Image();
    image.src = 'path_to_your_image.jpg'; // Replace with your image path
    image.onload = function () {
      // Resize the image to keep the aspect ratio with a fixed height of 32 pixels
      const targetHeight = 32; // Desired height
      const aspectRatio = image.width / image.height;
      const targetWidth = Math.round(targetHeight * aspectRatio);
  
      // Set the input canvas size to match the resized image dimensions
      inputCanvas.width = targetWidth;
      inputCanvas.height = targetHeight;
  
      // Draw the resized image on the input canvas
      inputCtx.drawImage(image, 0, 0, targetWidth, targetHeight);
  
      // Define the size of each piece and spacing
      const pieceSize = 16; // Original piece size
      const spacing = 2; // Space between pieces
  
      // Calculate the number of pieces needed
      const cols = Math.ceil(targetWidth / pieceSize);
      const rows = Math.ceil(targetHeight / pieceSize);
  
      // Set the output canvas size based on pieces, scale, and spacing
      const originalWidth = cols * (pieceSize + spacing) - spacing;
      const originalHeight = rows * (pieceSize + spacing) - spacing;
  
      outputCanvas.width = originalWidth;
      outputCanvas.height = originalHeight;
  
      // Draw each piece on the output canvas
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Calculate the position of the piece on the input canvas
          const x = col * pieceSize;
          const y = row * pieceSize;
  
          // Calculate the position on the output canvas
          const outputX = col * (pieceSize + spacing);
          const outputY = row * (pieceSize + spacing);
  
          // Extract and draw the piece onto the output canvas
          const piece = inputCtx.getImageData(x, y, pieceSize, pieceSize);
          outputCtx.putImageData(piece, outputX, outputY);
        }
      }
  
      // Adjust the CSS size of the output canvas to stretch it across the screen width while maintaining aspect ratio
      adjustCanvasSize(outputCanvas, originalWidth, originalHeight);
    };
  
    // Function to adjust the canvas size to fill the screen width
    function adjustCanvasSize(canvas, originalWidth, originalHeight) {
      // Get the scale factor based on the screen width
      const scaleFactor = window.innerWidth / originalWidth;
  
      // Set the canvas CSS width and height to scale proportionally
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${originalHeight * scaleFactor}px`;
  
      // Optionally, center the canvas on the screen
      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';
    }
  };
  
  document.getElementById('downloadBtn').addEventListener('click', function () {
    // Export canvas as an image
    const canvasImage = outputCanvas.toDataURL('image/png');
  
    // Create jsPDF instance
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
  
    // Add the canvas image to the PDF
    pdf.addImage(canvasImage, 'PNG', 10, 10, outputCanvas.width / 10, outputCanvas.height / 10); // Adjust dimensions as needed
  
    // Save the PDF
    pdf.save('canvas-output.pdf');
  });
  