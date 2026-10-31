// These styles ship with every snippet and are also used by its isolated preview.
export const componentStyles = `/* Neumorphism foundations. Keep the wrapper for scoped, portable styles. */
.neu {
  --neu-bg: #e9ece5;
  --neu-text: #30372b;
  --neu-muted: #626d59;
  --neu-accent: #536b3c;
  --neu-light: #ffffff;
  --neu-dark: #c7cdc1;
  --neu-radius: 10px;
  --neu-card-radius: 18px;
  --neu-raised: 6px 6px 14px var(--neu-dark), -6px -6px 14px var(--neu-light);
  --neu-inset: inset 3px 3px 7px var(--neu-dark), inset -3px -3px 7px var(--neu-light);
  box-sizing: border-box;
  width: 100%;
  padding: 28px;
  color: var(--neu-text);
  background: var(--neu-bg);
  font: 14px/1.5 system-ui, sans-serif;
  border-radius: 16px;
}
.neu *, .neu *::before, .neu *::after { box-sizing: border-box; }
.neu :where(h2, h3, p, ul, ol, figure, blockquote) { margin: 0; }
.neu :where(button, input, select, textarea) { font: inherit; color: inherit; }
.neu :where(button, summary, label:has(input[type=checkbox]), label:has(input[type=radio])) { cursor: pointer; }
.neu :where(a) { color: var(--neu-accent); text-underline-offset: 3px; }
.neu :focus-visible { outline: 2px solid var(--neu-accent); outline-offset: 4px; }
.neu :where(button, input, select, textarea):disabled { opacity: .5; cursor: not-allowed; }
.neu [hidden] { display: none !important; }
.neu .neu-stack { display: grid; gap: 16px; }
.neu .neu-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.neu .neu-between { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.neu .neu-muted { color: var(--neu-muted); font-size: 12px; }
.neu .neu-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 18px; border: 1px solid transparent; border-radius: var(--neu-radius);
  background: var(--neu-bg); box-shadow: var(--neu-raised);
  text-decoration: none; font-size: 13px; font-weight: 600;
  transition: box-shadow .18s, transform .18s;
}
.neu .neu-btn:hover { transform: translateY(-1px); }
.neu .neu-btn:active, .neu .neu-btn[aria-pressed=true] { box-shadow: var(--neu-inset); transform: none; }
.neu .neu-primary { background: var(--neu-accent); color: #fff; }
.neu .neu-icon { width: 42px; height: 42px; padding: 0; border-radius: 50%; font-size: 19px; }
.neu .neu-card { padding: 22px; border-radius: var(--neu-card-radius); background: var(--neu-bg); box-shadow: var(--neu-raised); }
.neu .neu-card h3 { font-size: 18px; letter-spacing: -.5px; }
.neu .neu-field {
  display: block; width: 100%; min-width: 0; padding: 12px 14px;
  border: 1px solid transparent; border-radius: var(--neu-radius);
  background: var(--neu-bg); box-shadow: var(--neu-inset);
}
.neu .neu-field::placeholder { color: var(--neu-muted); }
.neu .neu-label { display: grid; gap: 8px; font-size: 13px; font-weight: 600; }
.neu .neu-check { appearance: none; display: inline-grid; place-content: center; width: 20px; height: 20px; margin: 0 8px 0 0; border: 1px solid var(--neu-dark); border-radius: 5px; background: var(--neu-bg); box-shadow: 3px 3px 6px var(--neu-dark), -3px -3px 6px var(--neu-light); vertical-align: middle; }
.neu .neu-check::before { content: ''; width: 10px; height: 10px; background: var(--neu-accent); clip-path: polygon(14% 44%, 0 65%, 43% 100%, 100% 16%, 80% 0, 39% 62%); transform: scale(0); }
.neu .neu-check:checked { box-shadow: var(--neu-inset); }
.neu .neu-check:checked::before { transform: scale(1); }
.neu .neu-check[type=radio] { border-radius: 50%; }
.neu .neu-check[type=radio]::before { border-radius: 50%; clip-path: none; }
.neu .neu-toggle { display: inline-flex; align-items: center; gap: 12px; position: relative; }
.neu .neu-toggle input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.neu .neu-track { width: 50px; height: 28px; padding: 4px; border-radius: 20px; box-shadow: var(--neu-inset); background: var(--neu-bg); transition: background .2s; }
.neu .neu-track::after { content: ''; display: block; width: 20px; height: 20px; border-radius: 50%; background: var(--neu-bg); box-shadow: 2px 2px 5px #0002, -2px -2px 5px #fff8; transition: transform .2s; }
.neu .neu-toggle input:checked + .neu-track { background: var(--neu-accent); }
.neu .neu-toggle input:checked + .neu-track::after { transform: translateX(22px); }
.neu .neu-toggle input:focus-visible + .neu-track { outline: 2px solid var(--neu-accent); outline-offset: 4px; }
.neu .neu-toggle:has(input:disabled) { opacity: .5; cursor: not-allowed; }
.neu .neu-range { appearance: none; width: 100%; height: 8px; margin: 12px 0; border-radius: 20px; background: var(--neu-bg); box-shadow: var(--neu-inset); accent-color: var(--neu-accent); cursor: pointer; }
.neu .neu-range::-webkit-slider-thumb { appearance: none; width: 23px; height: 23px; border: 3px solid var(--neu-bg); border-radius: 50%; background: var(--neu-accent); box-shadow: 3px 3px 6px var(--neu-dark), -3px -3px 6px var(--neu-light); }
.neu .neu-range::-moz-range-thumb { width: 17px; height: 17px; border: 3px solid var(--neu-bg); border-radius: 50%; background: var(--neu-accent); box-shadow: 3px 3px 6px var(--neu-dark), -3px -3px 6px var(--neu-light); }
.neu input::file-selector-button { padding: 8px 10px; margin-right: 10px; border: 0; border-radius: 6px; background: var(--neu-bg); color: var(--neu-text); box-shadow: 2px 2px 4px var(--neu-dark), -2px -2px 4px var(--neu-light); cursor: pointer; }
.neu .neu-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 20px; font-size: 11px; color: var(--neu-accent); background: var(--neu-bg); box-shadow: 2px 2px 5px var(--neu-dark), -2px -2px 5px var(--neu-light); }
.neu .neu-avatar { display: inline-grid; place-items: center; width: 48px; height: 48px; flex-shrink: 0; border: 3px solid var(--neu-bg); border-radius: 50%; background: #d6dec9; color: #465a32; box-shadow: var(--neu-raised); font-size: 15px; font-weight: 700; }
.neu .neu-list { list-style: none; padding: 0; }
.neu .neu-list > li { padding: 12px 0; border-bottom: 1px solid var(--neu-dark); }
.neu .neu-list > li:last-child { border-bottom: 0; }
.neu .neu-table-wrap { overflow-x: auto; border-radius: 12px; padding: 10px; box-shadow: var(--neu-inset); }
.neu table { border-collapse: collapse; width: 100%; text-align: left; font-size: 12px; white-space: nowrap; }
.neu th, .neu td { padding: 12px; border-bottom: 1px solid var(--neu-dark); }
.neu th { color: var(--neu-muted); font-weight: 600; }
.neu .neu-progress { display: block; width: 100%; height: 12px; border: 0; border-radius: 20px; overflow: hidden; background: var(--neu-dark); box-shadow: var(--neu-inset); accent-color: var(--neu-accent); }
.neu .neu-progress::-webkit-progress-bar { background: var(--neu-bg); box-shadow: var(--neu-inset); border-radius: 20px; }
.neu .neu-progress::-webkit-progress-value { background: var(--neu-accent); border-radius: 20px; }
.neu .neu-progress::-moz-progress-bar { background: var(--neu-accent); border-radius: 20px; }
.neu .neu-spinner { display: inline-block; width: 32px; height: 32px; border: 3px solid var(--neu-dark); border-top-color: var(--neu-accent); border-radius: 50%; animation: neu-spin .8s linear infinite; }
.neu .neu-menu { padding: 8px; border-radius: 12px; background: var(--neu-bg); box-shadow: var(--neu-raised); }
.neu .neu-menu > a, .neu .neu-menu > button { display: block; width: 100%; padding: 9px 12px; border: 0; border-radius: 6px; text-align: left; color: inherit; background: transparent; text-decoration: none; }
.neu .neu-menu > :hover { background: #dce2d4; }
.neu .neu-dialog { max-width: min(380px, calc(100% - 32px)); padding: 26px; border: 1px solid var(--neu-dark); border-radius: var(--neu-card-radius); background: var(--neu-bg); color: var(--neu-text); box-shadow: var(--neu-raised); }
.neu .neu-dialog::backdrop { background: #1d251d70; backdrop-filter: blur(3px); }
.neu .neu-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@keyframes neu-spin { to { transform: rotate(360deg); } }
@keyframes neu-pulse { 50% { opacity: .45; } }
@media (prefers-reduced-motion: reduce) {
  .neu *, .neu *::before, .neu *::after { animation: none !important; transition: none !important; }
}
@media (max-width: 400px) { .neu { padding: 20px; } }
`;
