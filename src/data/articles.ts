export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
}

export interface ArticleDefinition {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  topic: 'Create' | 'Plan' | 'Protect' | 'Principles';
  readTime: string;
  published: string;
  updated: string;
  intro: string;
  sections: ArticleSection[];
  takeaways: string[];
  relatedProject?: 'svg-vector-lab' | 'project-quantity-lab' | 'photo-privacy-lab';
}

export const articles: ArticleDefinition[] = [
  {
    slug: 'edit-svg-online-without-uploading-files',
    title: 'How to edit SVG files online without uploading your artwork',
    shortTitle: 'Edit SVG files without uploading them',
    description:
      'A practical workflow for inspecting, editing, validating, and exporting SVG files in a browser while keeping artwork on your device.',
    topic: 'Create',
    readTime: '8 min read',
    published: '2026-07-22',
    updated: '2026-07-22',
    intro:
      'An online SVG editor can be convenient without becoming a file transfer service. The important distinction is where the file is processed. A browser-first editor can read, modify, and export an SVG inside the current tab, which avoids sending the artwork to an application server for routine editing.',
    sections: [
      {
        heading: 'Start by confirming the data boundary',
        paragraphs: [
          'The word online only tells you that the tool runs in a browser. It does not prove that processing is local. Read the product privacy statement and look for a direct explanation of uploads, storage, analytics, and third-party services. A responsible tool should distinguish the page request from the artwork you open inside the page.',
          'Browser developer tools can provide an additional check. Open the network panel, clear its history, then import a non-sensitive test file. If the tool works locally, normal asset and advertising requests may appear, but the SVG file itself should not be posted to an application endpoint. This is a useful verification technique, not a substitute for a clear policy.',
        ],
        bullets: [
          'Use a harmless test SVG before opening private client artwork.',
          'Check whether autosave uses device storage or a remote account.',
          'Confirm that export creates a local download rather than a public link.',
        ],
      },
      {
        heading: 'Inspect the document before changing it',
        paragraphs: [
          'SVG is both an image format and an XML document. A useful editor should expose the canvas, the element structure, and the source when you need it. Begin by checking the viewBox, width, height, and major groups. A missing or incorrect viewBox is a common reason artwork appears cropped, tiny, or impossible to scale predictably.',
          'Next, identify reusable definitions such as gradients, clipping paths, masks, and symbols. These elements may not be visible on their own, but visible shapes can depend on them. Deleting an apparently empty definitions group can change the whole illustration. Make one change at a time and use undo checkpoints before structural edits.',
        ],
      },
      {
        heading: 'Use the safest editing level for the task',
        paragraphs: [
          'Direct manipulation is best for moving, resizing, rotating, and adjusting path nodes. An attribute inspector is better for exact values such as fill colors, opacity, stroke width, and transform coordinates. Source editing is the most powerful option, but it also has the largest error surface. Reserve source changes for cases where the visual controls cannot express the intended result.',
          'When editing paths, distinguish end points from control handles. End points lie on the path. Control handles influence the curve and may sit away from it. Small movements can have large visual effects, so zoom in and keep an untouched copy until the result is confirmed.',
        ],
      },
      {
        heading: 'Validate and export deliberately',
        paragraphs: [
          'Before export, fit the full drawing into view and inspect the edges for clipping. Test transparency against both light and dark backgrounds. If text must render consistently elsewhere, decide whether to preserve editable text or convert it to paths. Converting text improves visual portability but removes easy editing and usually increases file size.',
          'Export SVG when the destination supports vectors and you want resolution-independent output. Export PNG for applications that require pixels or when you need a fixed preview. Open the downloaded result in a separate browser tab or viewer. The exported file, not the editor canvas, is the final artifact.',
        ],
        note: 'Keep the original file, an editable working copy, and the final export as separate files. That small habit makes destructive conversions reversible.',
      },
    ],
    takeaways: [
      'Verify that artwork stays in the browser before using sensitive files.',
      'Inspect the viewBox and document structure before editing individual shapes.',
      'Validate the downloaded file in a separate viewer before publishing it.',
    ],
    relatedProject: 'svg-vector-lab',
  },
  {
    slug: 'remove-photo-metadata-before-sharing',
    title: 'How to remove photo metadata before sharing an image',
    shortTitle: 'Remove photo metadata before sharing',
    description:
      'Learn what EXIF metadata can reveal, how to create a cleaner copy locally, and how to verify a photo before posting or sending it.',
    topic: 'Protect',
    readTime: '7 min read',
    published: '2026-07-22',
    updated: '2026-07-22',
    intro:
      'A photo can contain more information than the visible scene. Camera settings are usually harmless, but location coordinates, capture times, device details, and embedded descriptions can create privacy risks when an image is shared outside its original context. A safe workflow removes unnecessary metadata and then verifies the new copy.',
    sections: [
      {
        heading: 'Understand what may be attached to a photo',
        paragraphs: [
          'EXIF is the best-known metadata family, but it is not the only one. Image files may also contain IPTC descriptions, XMP editing history, color profiles, thumbnails, and vendor-specific fields. GPS latitude and longitude deserve special attention because they can identify a home, workplace, school, or repeated travel pattern.',
          'A timestamp can also be sensitive when combined with the visible scene or a public post. Device maker and model information is usually lower risk, yet it may help correlate images or reveal equipment value. The right goal is not to label every field dangerous. It is to share only the information needed for the recipient.',
        ],
      },
      {
        heading: 'Create a clean copy instead of modifying the original',
        paragraphs: [
          'Keep the original photo in a private location. Use a tool that decodes the image and writes a new file without copying unwanted metadata blocks. This gives you a clean sharing copy while preserving the original capture time, camera settings, and editing flexibility for your own archive.',
          'For sensitive images, prefer a browser-local workflow with an explicit no-upload statement. Start with a non-sensitive test image and confirm that the result is downloaded directly. Renaming a file or taking a screenshot can sometimes reduce metadata, but neither method is a reliable universal removal process.',
        ],
        bullets: [
          'Preserve the original in a private archive.',
          'Process a duplicate or create a new clean export.',
          'Use a descriptive filename that does not reveal a person or location.',
        ],
      },
      {
        heading: 'Inspect what the pixels still reveal',
        paragraphs: [
          'Metadata removal does not hide information visible in the image. Street signs, house numbers, school uniforms, reflections, badges, mail labels, computer screens, and vehicle plates can be more revealing than EXIF. Zoom into the full-resolution image and inspect the background as carefully as the subject.',
          'Cropping is useful when the sensitive detail sits near an edge. Redaction is appropriate when you must keep the surrounding context. A safe redaction needs to change the exported pixels, not place a removable shape above the original in an editable document. Avoid weak blur for text or codes that may remain recognizable.',
        ],
      },
      {
        heading: 'Verify the exact file you plan to share',
        paragraphs: [
          'Reopen the downloaded clean copy, not the editor preview. Scan it again for metadata and confirm that location fields are absent. Check image dimensions, orientation, color, and redacted areas. If a messaging or social platform creates another copy, remember that the platform controls its own processing and retention after upload.',
          'For especially sensitive material, share the minimum necessary image and use the recipient method with the smallest practical audience. Removing metadata reduces risk, but it does not control screenshots, downloads, backups, or later redistribution.',
        ],
        note: 'A clean metadata report and a visual inspection answer different questions. Use both before sharing a sensitive photo.',
      },
    ],
    takeaways: [
      'Make a separate clean copy and keep the original private.',
      'Inspect visible details such as signs, screens, labels, and reflections.',
      'Scan the final downloaded file again before you share it.',
    ],
    relatedProject: 'photo-privacy-lab',
  },
  {
    slug: 'estimate-project-materials-with-waste-factor',
    title: 'How to estimate project materials with a realistic waste factor',
    shortTitle: 'Estimate materials with a waste factor',
    description:
      'Use measured areas, package coverage, layout complexity, and a transparent waste allowance to build more reliable material estimates.',
    topic: 'Plan',
    readTime: '9 min read',
    published: '2026-07-22',
    updated: '2026-07-22',
    intro:
      'A material estimate should be understandable enough to audit. The useful calculation is not simply area multiplied by a percentage. Good planning separates measured quantity, exclusions, waste allowance, package rounding, and price so you can see why the shopping total changed.',
    sections: [
      {
        heading: 'Measure each area separately',
        paragraphs: [
          'Break the project into rectangles or other simple shapes and record every area as its own line. Separate rooms, wall sections, fence runs, or garden beds are easier to remeasure than one combined total. For an irregular floor, divide the outline into smaller rectangles, calculate each one, and add them together.',
          'Record openings and exclusions explicitly. A door may be worth subtracting from a wall paint estimate, while a small window might not justify the extra complexity. Consistency matters more than squeezing out a falsely precise number. Label every assumption so another person can reproduce the calculation.',
        ],
      },
      {
        heading: 'Choose waste based on the work, not habit',
        paragraphs: [
          'Waste covers offcuts, breakage, defects, pattern alignment, color matching, and future repairs. A simple rectangular room with straight-laid flooring usually needs less allowance than a diagonal layout with many corners. Large tiles in a small or irregular room can create more unusable offcuts than smaller pieces.',
          'Use the lowest allowance only when measurements are reliable, the layout is simple, and replacement material will remain available. Increase it when the pattern must match, the product has natural variation, the site has many penetrations, or a later batch may differ in color. Treat the percentage as a documented planning choice rather than a universal rule.',
        ],
        bullets: [
          'Simple layout and repeatable cuts: start with a modest allowance.',
          'Diagonal patterns, many corners, or fragile material: plan for more loss.',
          'Rare color lots or future repair needs: consider intentional spare stock.',
        ],
      },
      {
        heading: 'Round by the package you can actually buy',
        paragraphs: [
          'Retail products are sold in cans, boxes, bags, rolls, or standard lengths. Apply waste to the measured requirement, divide by package coverage, then round up to a whole purchasable unit. Rounding each room separately can overstate the total if opened packages can be shared across areas, so decide whether materials are interchangeable before rounding.',
          'Coverage claims also depend on the surface and application. Paint coverage can fall on porous walls. Concrete volume can change with excavation depth and base preparation. Flooring packages can state nominal coverage that assumes every piece is usable. Keep manufacturer guidance with the estimate and do not hide these limitations inside one percentage.',
        ],
      },
      {
        heading: 'Separate quantity confidence from price confidence',
        paragraphs: [
          'The quantity estimate can be stable while the budget changes. Record unit price, tax treatment, delivery, tool rental, and any refundable deposit separately. Add the date and supplier because prices and package sizes can change. A range is often more honest than a single final cost when the exact product is not selected.',
          'Before purchase, compare the estimate with field measurements and the chosen product specification. Structural, electrical, gas, load-bearing, and code-sensitive work needs qualified review. A browser calculator is a planning aid, not a substitute for site conditions or professional judgment.',
        ],
        note: 'Keep measured quantity, waste-adjusted quantity, package count, and cost as four visible numbers. That makes the estimate easier to challenge and update.',
      },
    ],
    takeaways: [
      'Measure and label separate areas before combining totals.',
      'Explain why the waste allowance fits the material and layout.',
      'Round to real package sizes and keep cost assumptions separate.',
    ],
    relatedProject: 'project-quantity-lab',
  },
  {
    slug: 'what-browser-first-tools-do-for-privacy',
    title: 'What browser-first tools can and cannot do for privacy',
    shortTitle: 'What browser-first privacy really means',
    description:
      'Understand local browser processing, ordinary web requests, device storage, third parties, and the limits of a browser-first privacy claim.',
    topic: 'Principles',
    readTime: '8 min read',
    published: '2026-07-22',
    updated: '2026-07-22',
    intro:
      'Browser-first describes an architecture, not a guarantee. It usually means the main task happens in code running on your device, but the surrounding website may still request assets, advertising, consent tools, or error reporting. A useful privacy explanation separates the content you work on from ordinary website traffic.',
    sections: [
      {
        heading: 'Local processing changes the main risk boundary',
        paragraphs: [
          'In a traditional upload workflow, your file travels to a server, is processed there, and may be stored in logs, queues, backups, or a user account. In a local workflow, browser code reads the file into memory and creates the result on the same device. The application server does not need the file contents to complete the task.',
          'This can reduce exposure and make the tool faster for large files, but it does not make the browser a sealed environment. Browser extensions, compromised devices, malicious scripts, and operating system backups remain relevant. Local processing is one useful control inside a larger security model.',
        ],
      },
      {
        heading: 'Page traffic is different from work content',
        paragraphs: [
          'Opening any public site normally reveals an IP address, user agent, requested path, and timing information to the hosting provider. Cached assets and security services may be handled by a content delivery network. If advertising or analytics are present, those third parties can receive additional requests according to their configuration and the user consent state.',
          'A precise policy should say whether selected files, pasted text, project measurements, or edited content leave the device. It should also disclose third-party scripts separately. Statements such as everything is private are too broad to be useful because they blur several different data flows.',
        ],
      },
      {
        heading: 'Device storage is still storage',
        paragraphs: [
          'Local storage, IndexedDB, and browser caches can preserve settings or work between sessions. That can be convenient, especially for offline-capable tools, but it means another person using the same browser profile may see saved data. Private browsing modes, browser cleanup settings, and device account separation affect how long local data remains available.',
          'Look for controls to clear saved work and understand what a reset removes. A site should not describe local storage as no storage. The accurate claim is that storage stays in the browser profile unless a sharing or synchronization feature explicitly sends it elsewhere.',
        ],
      },
      {
        heading: 'Evaluate browser-first claims with practical checks',
        paragraphs: [
          'Read the privacy page, inspect the permission prompts, and use a test file. The browser network panel can show whether work content is posted after an import or action. A content security policy can limit where scripts and connections are allowed, although it must be reviewed in context and does not prove that application logic is safe.',
          'Finally, match the tool to the sensitivity of the task. A local utility can be appropriate for everyday creative files or household planning. Highly confidential, regulated, or legally sensitive material may require an approved offline environment, managed device, or organizational security review.',
        ],
        note: 'Good privacy communication names the data, the destination, the purpose, and the retention boundary. Architecture labels alone are not enough.',
      },
    ],
    takeaways: [
      'Local processing can keep work content away from an application server.',
      'Hosting, advertising, and other page requests are separate data flows.',
      'Local storage and device security still need deliberate handling.',
    ],
  },
  {
    slug: 'how-to-inspect-an-svg-file-safely',
    title: 'How to inspect an SVG file safely before editing or publishing it',
    shortTitle: 'Inspect an SVG file safely',
    description:
      'A practical SVG inspection checklist covering active content, external references, document structure, rendering, and safe export.',
    topic: 'Create',
    readTime: '8 min read',
    published: '2026-07-22',
    updated: '2026-07-22',
    intro:
      'SVG files are readable vector documents, but they can also contain scripts, event handlers, external references, embedded HTML, and complex resource links. Treat an unfamiliar SVG as active content until it has been parsed and sanitized by a tool designed for untrusted input.',
    sections: [
      {
        heading: 'Do not begin with raw browser navigation',
        paragraphs: [
          'Opening an unknown SVG directly can give it an execution context that differs from a safely embedded image. The exact behavior depends on the browser and how the file is loaded. A safer first step is to use a text viewer, code editor with execution disabled, or an application that documents its SVG sanitization boundary.',
          'Keep the original file untouched. Work from a copy in a folder that does not contain sensitive adjacent files. If the source is untrusted, do not enable macros, extensions, or helper applications simply because the file requests them.',
        ],
      },
      {
        heading: 'Look for active and remote features',
        paragraphs: [
          'Search the source for script elements, event attributes such as onload, foreignObject content, external image URLs, stylesheet imports, and links that use unexpected protocols. Also inspect use elements and resource references because visible shapes can depend on definitions elsewhere in the document.',
          'A safe sanitizer should use allowlists for elements, attributes, URL schemes, and reference targets. Simple string replacement is not enough for XML and CSS contexts. If a tool cannot explain how it handles active SVG features, use it only with files you already trust.',
        ],
        bullets: [
          'Block scripts and event-handler attributes.',
          'Reject unsafe URL schemes and unexpected remote resources.',
          'Preserve safe gradients, masks, clips, and internal references when supported.',
        ],
      },
      {
        heading: 'Check the visual and structural basics',
        paragraphs: [
          'After sanitization, inspect the viewBox, dimensions, namespaces, groups, transforms, and definitions. Confirm that the artwork fits the declared coordinate system and that no large invisible shapes extend the bounds. Unexpected full-canvas rectangles or nearly transparent objects may affect selection and export.',
          'Review text and fonts. A file can look correct on the creator\'s device but change when a font is missing. Decide whether to embed an approved font, use a safe fallback, or convert final lettering to paths. Keep an editable version before converting text.',
        ],
      },
      {
        heading: 'Export a clean artifact and test the destination',
        paragraphs: [
          'Save the sanitized result as a new file, then reopen that exact file in a separate viewer. If the SVG will be embedded on a website, use the safest embedding method that meets the product need and apply the site content security policy. Serving user-controlled SVG as an inline document has a different risk profile from rendering a trusted image asset.',
          'Run both visual and security checks after optimization. Some optimization tools rewrite identifiers, merge paths, or remove definitions. The smallest file is not automatically the best file if accessibility text, editability, or safe references are lost.',
        ],
        note: 'Sanitization must happen at every untrusted input boundary. A clean file can become unsafe again if later source edits add active content.',
      },
    ],
    takeaways: [
      'Treat unfamiliar SVG as active content until it is sanitized.',
      'Check scripts, event handlers, remote URLs, and embedded HTML.',
      'Verify the final exported file visually and in its real publishing context.',
    ],
    relatedProject: 'svg-vector-lab',
  },
  {
    slug: 'build-a-reliable-home-project-shopping-list',
    title: 'How to build a reliable home project material shopping list',
    shortTitle: 'Build a reliable material shopping list',
    description:
      'Turn measurements into a practical shopping list with package counts, assumptions, price dates, alternates, and final checks.',
    topic: 'Plan',
    readTime: '9 min read',
    published: '2026-07-22',
    updated: '2026-07-22',
    intro:
      'A useful shopping list connects every item to a measured need. It should tell you what to buy, how much, why that quantity is reasonable, and which assumptions still need confirmation. That makes the list easier to revise at the store without losing the logic behind it.',
    sections: [
      {
        heading: 'Begin with scope, not products',
        paragraphs: [
          'Write one sentence that defines the work, then divide it into areas. For example, repaint two bedrooms and one hallway is more useful than buy paint. Record the dimensions, units, exclusions, number of coats, surface condition, and any work that belongs to another phase.',
          'Keep measurements in one unit system through the calculation. Convert only at clear input or output boundaries. Mixing feet, inches, metres, and centimetres inside one formula is a common source of errors that look plausible on a finished list.',
        ],
      },
      {
        heading: 'Separate primary material from supporting items',
        paragraphs: [
          'Primary material covers the finished area: paint, flooring, concrete, soil, or fence boards. Supporting items make the installation possible: primer, underlayment, fasteners, edging, joint material, masking supplies, blades, and disposal bags. Safety equipment and tool rental belong in their own section so they are not forgotten or confused with consumable material.',
          'Do not turn a calculator into a universal construction prescription. Supporting requirements depend on the selected product, substrate, local code, and manufacturer instructions. Use the list as a prompt to confirm specifications rather than an authoritative design.',
        ],
      },
      {
        heading: 'Record package size and purchase quantity',
        paragraphs: [
          'Store both the calculated requirement and the rounded purchase quantity. If 8.4 boxes are needed, the list should show why 9 boxes appear in the cart. For products with several package sizes, compare combinations by total coverage, cost, handling, and leftover material instead of assuming the largest package is always best.',
          'Include product identifiers, color or lot requirements, and acceptable alternates. A photo of the shelf label can help, but copy the important facts into the list because links and inventory can change. Mark items that must match exactly and those where substitution is safe.',
        ],
        bullets: [
          'Calculated need before package rounding.',
          'Waste or spare-stock allowance with a reason.',
          'Whole package count and coverage per package.',
          'Unit price, price date, supplier, and delivery assumptions.',
        ],
      },
      {
        heading: 'Run a final field check before purchase',
        paragraphs: [
          'Remeasure critical dimensions and confirm that openings, slopes, depth, and layout direction were handled correctly. Compare the planned product specification with the surface and site conditions. Check stock availability before scheduling labor, especially when the material must come from one production lot.',
          'Print or export the list with the project name and revision date. After purchase, record actual package counts and returns. That history improves later estimates and gives you a realistic personal waste rate. For regulated or safety-critical work, have the scope and materials reviewed by a qualified professional.',
        ],
        note: 'The list is ready when another person can trace each purchase quantity back to a measurement, package specification, and stated assumption.',
      },
    ],
    takeaways: [
      'Define the work and measure areas before choosing products.',
      'Show calculated need and rounded purchase quantity separately.',
      'Date prices and confirm specifications before buying.',
    ],
    relatedProject: 'project-quantity-lab',
  },
];

export function articlePath(article: ArticleDefinition) {
  return `/articles/${article.slug}/`;
}

export function articleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
