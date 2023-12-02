import styled from 'styled-components';

const StyledImagePrediction = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 250px;
    height: 250px;
    border-radius: 10px;
  }

  p {
    margin-bottom: 0;
    font-weight: bold;
  }

  .result {
    color: ${(props) =>
      props.hasDementia === 'HAS DEMENTIA'
        ? 'red'
        : props.hasDementia === 'NO DEMENTIA'
        ? 'green'
        : 'blue'};
  }
`;

const ImagePrediction = ({ base64Data, hasDementia }) => {
  return (
    <StyledImagePrediction hasDementia={hasDementia}>
      <img src={base64Data} />
      <p>
        Prediction: <span className='result'>{hasDementia}</span>
      </p>
    </StyledImagePrediction>
  );
};

export default ImagePrediction;
