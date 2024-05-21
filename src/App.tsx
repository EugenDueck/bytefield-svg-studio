import {createEffect, createSignal} from 'solid-js';
import './App.css';
import generate from 'bytefield-svg';
import sampleDiagramSource from "./sample-diagram-source.ts";
import githubMark from './assets/github-mark.svg'

function App() {
    const copyBtnLabel = 'Copy SVG';
    const textPlaceholder = `Enter a bytefield-svg diagram here`
    const [text, setText] = createSignal(sampleDiagramSource);
    const [svg, setSvg] = createSignal<string>();
    const [copyButtonLabel, setCopyButtonLabel] = createSignal(copyBtnLabel);
    const [errorMsg, setErrorMsg] = createSignal<string | null>('');

    function generateDiagram(diagramSource: string, curDiagram: string | undefined): string | undefined {
        setErrorMsg(null)
        try {
            return generate(diagramSource, {"embedded": true});
        } catch (e) {
            setErrorMsg("Error generating diagram\n\n" + (e as any)?.message ?? String(e))
            return curDiagram
        }
    }

    createEffect(() => {
        setSvg(generateDiagram(text(), ""));
    });

    function handleInput(event: Event) {
        const eventTarget = event.target as HTMLTextAreaElement;
        const newDiagramSource = eventTarget.value;
        setText(newDiagramSource);
        setSvg(curDiagram => generateDiagram(newDiagramSource, curDiagram))
    }

    const downloadSvg = () => {
        const svgStr = svg()
        if (svgStr == null)
            return
        const svgBlob = new Blob([svgStr], {type: 'image/svg+xml;charset=utf-8'});
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
        const svgStr = svg()
        if (svgStr == null)
            return
        try {
            await navigator.clipboard.writeText(svgStr);
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
            <div class="output">
                {errorMsg() ? (
                    <textarea class="error" readonly={true} innerHTML={errorMsg() ?? ''}/>
                ) : (
                    <div class="diagram" innerHTML={svg()}></div>
                )}
            </div>
        </div>
    );
}

export default App;
