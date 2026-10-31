import styled from 'styled-components';

const PreviewBox = styled.div`
  background: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: ${({ $borderRadius }) => `${$borderRadius}px`};
  box-shadow: ${({ $distance, $blur, $darkColor, $lightColor }) =>
    `${$distance}px ${$distance}px ${$blur}px ${$darkColor}, -${$distance}px -${$distance}px ${$blur}px ${$lightColor}`};
  height: ${({ $size }) => `${$size}px`};
  width: ${({ $size }) => `${$size}px`};
  flex-shrink: 0;
`;

const PreviewWrapper = styled.section`
  align-items: center;
  display: flex;
  flex: 0 1 550px;
  justify-content: center;
  min-height: 550px;
  min-width: 0;
  overflow: auto;
  padding: 64px;
`;

export default function Preview({ settings, lightColor, darkColor }) {
  return (
    <PreviewWrapper aria-label="Preview">
      <PreviewBox
        role="img"
        aria-label="Neumorphic shape"
        $backgroundColor={settings.backgroundColor}
        $size={settings.size}
        $borderRadius={settings.borderRadius}
        $blur={settings.blur}
        $distance={settings.distance}
        $lightColor={lightColor}
        $darkColor={darkColor}
      />
    </PreviewWrapper>
  );
}
