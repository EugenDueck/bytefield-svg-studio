import {createSignal} from 'solid-js';
import './App.css';
import generate from 'bytefield-svg';
import sampleDiagramSource from "./sample-diagram-source.ts";
import githubMark from './assets/github-mark.svg'

function App() {
    const copyBtnLabel = 'Copy SVG';
    const textPlaceholder = `Enter a bytefield-svg diagram here`
    const [text, setText] = createSignal(sampleDiagramSource);
    const [svg, setSvg] = createSignal(generateDiagram(text()));
    const [copyButtonLabel, setCopyButtonLabel] = createSignal(copyBtnLabel);

    function generateDiagram(diagramSource: string): string {
        return generate(diagramSource, {"embedded": true});
    }

    function handleInput(event: Event) {
        const eventTarget = event.target as HTMLTextAreaElement;
        const newDiagramSource = eventTarget.value;
        setText(newDiagramSource);
        setSvg(generateDiagram(newDiagramSource))
    }

    const downloadSvg = () => {
        const svgBlob = new Blob([svg()], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'downloaded.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup URL object
        URL.revokeObjectURL(url);
    };

    const copySvg = async () => {
        try {
            await navigator.clipboard.writeText(svg());
            setCopyButtonLabel('Copied!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            setCopyButtonLabel('Error!');
        }
        setTimeout(() => setCopyButtonLabel(copyBtnLabel), 1000);
    };

    return (
        <div class="app-container">
            <h4 class="title">
                <a target="_blank" href="https://github.com/EugenDueck/bytefield-svg-studio"> <img
                    class="github-icon"
                    src={githubMark}
                    alt="Link to GitHub"
                /></a>
                <span>ByteField-SVG Studio </span>
                <a target="_blank" href="https://bytefield-svg.deepsymmetry.org/bytefield-svg/intro.html">(ByteField
                    Format Docs)</a>
                <button onClick={copySvg}>{copyButtonLabel()}</button>
                <button onClick={downloadSvg}>Download SVG</button>
            </h4>
            <textarea
                class="source"
                value={text()}
                onInput={handleInput}
                placeholder={textPlaceholder}
            ></textarea>
            <div class="output" innerHTML={svg()}></div>
        </div>
    );
}

export default App;
