import styled from 'styled-components';

export const Flex = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-block: 20px;

  label {
    flex: 1 0 100px;
  }

  input[type='range'] {
    flex: 1 1 120px;
    min-width: 0;
  }

  output {
    font-variant-numeric: tabular-nums;
  }
`;
