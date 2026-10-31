import GeneratorHeader from './GeneratorHeader.jsx';
import Configuration from './Configuration.jsx';
import Preview from './Preview.jsx';
import CodeOutput from './CodeOutput.jsx';
import useGeneratorSettings from '../../hooks/useGeneratorSettings.js';
import { createNeumorphicStyle, formatCSS } from '../../lib/neumorphism.js';
import { sitePaths } from '../../lib/sitePaths.js';
import './Generator.css';

export default function Generator() {
  const { settings, formVersion, changeSetting, resetSettings } = useGeneratorSettings();
  const surfaceStyle = createNeumorphicStyle(settings);
  const css = formatCSS(surfaceStyle);

  return (
    <main id="main-content" tabIndex={-1}>
      <GeneratorHeader onReset={resetSettings} />
      <div className="workspace">
        <Preview
          settings={settings}
          surfaceStyle={surfaceStyle}
          onSettingChange={changeSetting}
        />
        <aside className="inspector" aria-label="Design editor">
          <Configuration
            key={formVersion}
            settings={settings}
            onSettingChange={changeSetting}
          />
        </aside>
        <CodeOutput code={css} backgroundColor={settings.backgroundColor} />
      </div>
      <section className="generator-library-teaser" aria-labelledby="generator-library-title">
        <div><span>THE COMPONENT COLLECTION</span><h2 id="generator-library-title">From one surface to a whole interface.</h2><p>Explore cards, switches, inputs, and more. Preview every detail and copy the HTML & CSS.</p></div>
        <a href={sitePaths.components}>Explore components <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}
