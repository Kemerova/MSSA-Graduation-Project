# Design Document: Slide Refinement

## Overview

This design document outlines the approach for refining the layout and visual elements of the first slide in the "Lock, Stock, and Two Smoking Servers" presentation. The goal is to create a clean, balanced, and professional appearance by removing unwanted elements, adjusting sizes, preventing cropping, and optimizing scrolling behavior.

## Current Issues

1. **Unwanted Giant Image:** A large "LOCK, STOCK, AND TWO SMOKING SERVERS" title image extends below the main content area, creating overlap and clutter.
2. **Small Logo:** The logo image on the right side is too small and not prominent enough.
3. **Image Cropping:** The slide image on the left (comic-style group illustration) may be cropped in certain viewports.
4. **Suboptimal Text Scrolling:** The scrolling text in the text box doesn't have optimal animation behavior.
5. **Layout Balance:** The three main elements (slide image, text box, logo) don't collectively fill the window space horizontally in a balanced way.

## Design Solution

### Layout Structure

The refined slide layout will use a CSS Grid layout with the following structure:

```
+-------------------+------------------------+-------------+
|                   |                        |             |
|                   |                        |             |
|   Slide Image     |      Text Box          |    Logo     |
|      (40%)        |       (50%)            |    (10%)    |
|                   |                        |             |
|                   |                        |             |
+-------------------+------------------------+-------------+
```

### Visual Design

#### Slide Image (Left)
- Full display without cropping using `object-fit: contain`
- Responsive to fill its container appropriately
- Maintains aspect ratio
- Subtle border radius and shadow for visual appeal

#### Text Box (Center)
- Increased width (50% of available space)
- Smooth scrolling animation that starts from the bottom and ends at the top
- Pause on hover functionality
- Appropriate padding and line height for readability
- Subtle background color for contrast

#### Logo (Right)
- Enlarged to 100-150px in height
- Maintains aspect ratio
- Centered within its container
- Subtle shadow and border for visual appeal

### Removed Elements
- The giant "LOCK, STOCK, AND TWO SMOKING SERVERS" title image that appears underneath the text box will be completely removed.

### Unchanged Elements
- Header
- Progress bar
- Navigation buttons (Previous/Play/Next)
- Speed controls

## Wireframe

```
+---------------------------------------------------------------+
|                         Header                                |
+---------------------------------------------------------------+
|                      Progress Bar                             |
+---------------------------------------------------------------+
|                                                               |
|  +-------------+  +----------------+  +-------------------+   |
|  |             |  |                |  |                   |   |
|  |             |  |                |  |                   |   |
|  |   Slide     |  |    Text        |  |                   |   |
|  |   Image     |  |    Box         |  |       Logo        |   |
|  |   (40%)     |  |    (50%)       |  |       (10%)       |   |
|  |             |  |                |  |                   |   |
|  |             |  |                |  |                   |   |
|  |             |  |                |  |                   |   |
|  +-------------+  +----------------+  +-------------------+   |
|                                                               |
+---------------------------------------------------------------+
|                      Controls                                 |
+---------------------------------------------------------------+
```

## Responsive Behavior

### Desktop (>= 1200px)
- Three-column layout as described above
- Full-width container (max-width: 1600px)
- Proportional spacing between elements

### Tablet (768px - 1199px)
- Three-column layout maintained
- Slightly adjusted proportions (35% image, 55% text, 10% logo)
- Reduced padding and margins

### Mobile (< 768px)
- Stack elements vertically
- Order: Image, Text, Logo
- Full-width elements with appropriate padding

## Animation Specifications

### Text Scrolling Animation
- **Starting Position:** Text starts fully below the visible area of the text box
- **Ending Position:** Text ends fully above the visible area of the text box
- **Duration:** Calculated based on text length (longer text = slower scroll)
- **Timing Function:** Linear for smooth, consistent scrolling
- **Pause on Hover:** Animation pauses when user hovers over the text box
- **Restart:** Animation restarts when slide is revisited

## Technical Implementation

### CSS Techniques
- CSS Grid for main layout structure
- Flexbox for alignment within containers
- `object-fit: contain` for preventing image cropping
- CSS animations with keyframes for text scrolling
- CSS variables for consistent spacing and sizing
- Media queries for responsive behavior

### JavaScript Enhancements
- Dynamic calculation of scroll duration based on text length
- Pause/resume animation on hover
- Ensuring animation resets when changing slides

## Design Decisions and Rationales

1. **Grid Layout (40-50-10):** This distribution gives more space to the text content while still providing adequate space for the image and making the logo more prominent.

2. **Object-fit: Contain:** This ensures the slide image is never cropped, preserving the full visual content regardless of viewport size.

3. **Bottom-to-Top Scrolling:** This creates a more natural reading experience as new content appears from the bottom (like a teleprompter), making it easier to follow.

4. **Pause on Hover:** This enhances user experience by allowing users to stop the animation when they want to read specific content.

5. **Removal of Giant Image:** Eliminating this element reduces visual clutter and focuses attention on the essential content.