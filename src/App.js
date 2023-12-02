import './App.css';

import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
// import { uuid } from 'uuidv4';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';

import { convertBase64ToPythonBase64, toBase64 } from './util';
import ImagePredictions from './components/ImagePredictions';

const StyledApp = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const DragAndDropStyled = styled.div`
  width: 500px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 5px dashed #ccc;
  background: ${(props) => (props.isDragActive ? '#eee' : '#fff')};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const uuid = new ShortUniqueId({ length: 10 });

function App() {
  const [imagesBase64, setImagesBase64] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const promises = acceptedFiles.map((file) => toBase64(file));

      const images = await Promise.all(promises);
      const imagesWithId = images.map((image) => ({
        id: uuid.rnd(),
        base64Data: image,
        hasDementia: 'PENDING...',
      }));
      setImagesBase64(imagesWithId);

      const imagesForPython = imagesWithId.map((image) => ({
        id: image.id,
        base64Data: convertBase64ToPythonBase64(image.base64Data),
      }));

      const res = await axios.post(
        'https://alzheimer-detection-4d571ca29b82.herokuapp.com/upload',
        {
          images: imagesForPython,
        }
      );

      const predictions = res.data.predictions;

      const imagesWithPrediction = imagesWithId.map((image) => {
        const { id } = image;
        const { hasDementia } = predictions.find((image) => image.id === id);
        return { ...image, hasDementia };
      });

      setImagesBase64(imagesWithPrediction);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <StyledApp>
      <h2>
        You can download data from{' '}
        <a
          target='_blank'
          href='https://www.kaggle.com/datasets/uraninjo/augmented-alzheimer-mri-dataset'
        >
          here
        </a>
      </h2>
      <DragAndDropStyled isDragActive={isDragActive} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here ...</p>
        ) : (
          <p>Drag images here, or click to select images</p>
        )}
      </DragAndDropStyled>

      <ImagePredictions imagePredictions={imagesBase64} />
    </StyledApp>
  );
}

export default App;
