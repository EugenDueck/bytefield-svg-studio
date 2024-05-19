import {createSignal} from 'solid-js';
import './App.css';
import generate from 'bytefield-svg';
import sampleDiagramSource from "./sample-diagram-source.ts";
import githubMark from './assets/github-mark.svg'

function App() {
    const textPlaceholder = `Enter a bytefield-svg diagram here`
    const [text, setText] = createSignal(sampleDiagramSource);
    const [svg, setSvg] = createSignal(generateDiagram(text()));

    function generateDiagram(diagramSource: string): string {
        return generate(diagramSource, {"embedded": true});
    }

    function handleInput(event: Event) {
        const eventTarget = event.target as HTMLTextAreaElement;
        const newDiagramSource = eventTarget.value;
        setText(newDiagramSource);
        setSvg(generateDiagram(newDiagramSource))
    }

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
