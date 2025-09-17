import FilePanel from '../components/elements/FilePanel';
import { generateFromAudioApi } from '../api';

export default function AudioPage() {
  return (
    <FilePanel
      mode="audio"
      accept="audio/*"
      helper="Max 25MB"
      submit={generateFromAudioApi}
    />
  );
}
