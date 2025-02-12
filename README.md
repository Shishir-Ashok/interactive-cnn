<div align="center">
    <h1 align="center">NeuroVision - CNN Visualizer</h1>

Website → [shishir-ashok.github.io/interactive-cnn/](https://shishir-ashok.github.io/interactive-cnn/)
</div>

**NeuroVision** is an interactive tool designed to help you understand how Convolutional Neural Networks (CNNs) work. By visualizing how a filter (or pooling operation) moves over an input matrix (representing an image), this tool demonstrates how the output (feature map) is generated.

## Features

- **Interactive Controls:**  
  - **Matrix Size:** Choose the dimensions of the input matrix. The matrix is populated with random values.
  - **Filter Size:** Specify the size of the filter (or pooling window). This determines how many cells from the input are grouped together.
  - **Stride:** Set how many cells the sliding window jumps with each move. A larger stride results in fewer overlapping regions.
  - **Padding:** Add zero-padding around the input matrix. This can help preserve spatial dimensions during convolution.
  - **Operation:** Select between different operations:
    - **Convolution:** Computes the sum of the values covered by the filter.
    - **Max Pooling:** Chooses the maximum value in the filter window.
    - **Average Pooling:** Computes the (rounded) average value in the filter window.
  - Click on any cell within the input matrix to change its value
- **Animated Sliding Window:**  
  A smoothly animated sliding window moves over the input matrix. As it moves, the corresponding cell in the output matrix is highlighted.
- **Pause/Resume Functionality:**  
  A dedicated button allows you to pause the animation (freezing the sliding window on the current block) and resume it from where it left off.
- **Randomization:**  
  The "Randomize Matrix" button regenerates the input matrix with new random values.

## How It Works

1. **Matrix and Filter Setup:**  
   - The input matrix is generated based on the **Matrix Size** value.
   - The **Filter Size** determines how many cells are processed together.
   - **Stride** controls the jump length of the sliding window.
   - **Padding** adds a border of zeros to the matrix.

2. **Visualizing the Operation:**  
   - The sliding window (representing the filter) moves over the input matrix using a smooth CSS transition.
   - As the window moves, it performs the selected operation (convolution, max pooling, or average pooling) on the block of cells it covers.
   - The result is reflected in the output matrix, where the corresponding output cell is highlighted.

3. **Interactive Learning:**  
   - Adjusting controls like filter size or stride helps visualize how these parameters affect the output.
   - The pause/resume feature lets you stop the animation to examine a particular step in detail.

## How to Use

1. **Adjust Controls:**  
   - **Matrix Size:** Set the desired dimension (e.g., 9, 10, 15).
   - **Filter Size:** Choose the size of the filter window.
   - **Stride:** Define how far the filter moves each step.
   - **Padding:** Add or remove padding as needed.
   - **Operation:** Select whether to perform convolution, max pooling, or average pooling.

3. **Randomize & Pause/Resume:**  
   - Click **"Randomize Matrix"** to generate a new input matrix.
   - Use the **"Pause"** button to stop the sliding window’s animation; it will change to **"Resume"** when paused. Click it again to continue the animation from its current position.

## Educational Benefits

- **Understanding Convolution:**  
  Watch how the filter covers different parts of the input matrix and produces a new output feature map.
  
- **Interactive Parameter Tuning:**  
  See first-hand how adjusting stride, filter size, and padding affects the output dimensions and values.
  
- **Step-by-Step Animation:**  
  The animated sliding window helps you follow the process of feature extraction in a CNN.

