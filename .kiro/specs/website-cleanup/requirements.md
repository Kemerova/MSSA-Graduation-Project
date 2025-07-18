# Requirements Document

## Introduction

This document outlines the requirements for cleaning up the MSSA Cohort Chronicles website by removing the chatbot functionality and fixing deployment issues. The website currently has a chatbot feature that needs to be removed, and there are deployment issues preventing the site from being properly displayed (currently showing "Congratulations on your new site! Your site will be ready soon—please check back later").

## Requirements

### Requirement 1: Chatbot Removal

**User Story:** As a website administrator, I want to completely remove the chatbot functionality from the website, so that the site is simpler and focuses only on the slideshow presentation.

#### Acceptance Criteria

1. WHEN the website is loaded THEN no chatbot button or interface shall be visible
2. WHEN the website code is examined THEN all chatbot-related JavaScript functions shall be removed
3. WHEN the website is loaded THEN no chatbot-related resources shall be loaded or initialized
4. WHEN the user interacts with the website THEN no chatbot functionality shall be accessible
5. WHEN the website is loaded THEN the UI shall maintain its visual integrity without the chatbot elements

### Requirement 2: Fix Website Deployment

**User Story:** As a website administrator, I want the website to deploy properly to Azure Static Web Apps, so that users can access the content without seeing deployment placeholder messages.

#### Acceptance Criteria

1. WHEN the website is deployed THEN it shall display the actual website content instead of the "Congratulations on your new site" message
2. WHEN the website is deployed THEN all resources (HTML, CSS, JavaScript, images) shall be properly loaded
3. WHEN the website is deployed THEN the routing configuration shall correctly direct users to the main content
4. WHEN the website is deployed THEN the site shall function correctly without errors
5. WHEN examining the deployment configuration THEN it shall follow Azure Static Web Apps best practices
6. WHEN the website is deployed THEN it shall not require the API functionality that was used by the chatbot

### Requirement 3: Update Slide Content

**User Story:** As a website administrator, I want to update the slide content with specific text for each slide, so that the presentation tells the cohort's story accurately.

#### Acceptance Criteria

1. WHEN the website is loaded THEN the slideshow shall display the updated content for each slide
2. WHEN viewing slide 1 THEN it shall display the "Lock, Stock, and Two Smoking Servers: A MSSA Odyssey" introduction content
3. WHEN viewing slide 2 THEN it shall display the "Power-Hell Chronicles" content
4. WHEN viewing slide 3 THEN it shall display the "ProDev with Fiona" content
5. WHEN viewing slide 4 THEN it shall display the "Server Administration with Dave" content
6. WHEN viewing slide 5 THEN it shall display the "Azure Principles with Godfrey" content
7. WHEN viewing slide 6 THEN it shall display the "Microsoft 365 Endpoint Administration" content
8. WHEN viewing slide 7 THEN it shall display the "From Power-Hell to Cloud Heaven" conclusion content

### Requirement 4: Maintain Core Website Functionality

**User Story:** As a website user, I want all the core slideshow functionality to remain intact after the changes, so that I can still view the MSSA journey presentation.

#### Acceptance Criteria

1. WHEN the website is loaded THEN the slideshow shall display correctly
2. WHEN the user navigates through slides THEN the navigation controls shall work properly
3. WHEN slides change THEN the progress bar shall update correctly
4. WHEN the website is loaded THEN all styling and visual elements (except chatbot) shall appear as intended
5. WHEN the website is loaded on different devices THEN it shall remain responsive and functional

### Requirement 5: Optimize Text Display

**User Story:** As a website user, I want text content that fits properly on the screen with appropriate scrolling speed for readability, so that I can comfortably read all the content.

#### Acceptance Criteria

1. WHEN a slide contains text that exceeds the visible area THEN the text shall automatically scroll at a comfortable reading speed
2. WHEN text is scrolling THEN the speed shall be slow to medium (appropriate reading pace)
3. WHEN the website is viewed on different screen sizes THEN the text scrolling shall adapt appropriately
4. WHEN a slide changes THEN the text position shall reset to the beginning
5. WHEN text is displayed THEN it shall be properly formatted and readable

### Requirement 6: Logo Flash Feature

**User Story:** As a website designer, I want to display different logo concepts between slide transitions, so that users can see various logo ideas for the cohort.

#### Acceptance Criteria

1. WHEN transitioning between slides THEN a logo image shall flash/display for 3 seconds
2. WHEN the logo is displayed THEN it shall be clearly visible and centered
3. WHEN multiple slide transitions occur THEN different logo images shall be shown in sequence
4. WHEN the logo flash occurs THEN it shall not disrupt the normal slide transition flow
5. WHEN the 3-second display period ends THEN the logo shall smoothly transition to the next slide content