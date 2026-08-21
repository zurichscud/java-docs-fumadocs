'use client';

import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  type SandpackProps,
} from '@codesandbox/sandpack-react';

type SandpackOptions = NonNullable<SandpackProps['options']> & {
  showOpenInCodeSandbox?: boolean;
};

type Props = Omit<SandpackProps, 'options'> & {
  options?: SandpackOptions;
};

export function Sandpack({ options, ...props }: Props) {
  const { showOpenInCodeSandbox = false, ...sandpackOptions } = options ?? {};

  return (
    <SandpackProvider {...props} options={sandpackOptions}>
      <SandpackLayout>
        <SandpackCodeEditor
          closableTabs={sandpackOptions.closableTabs}
          initMode={sandpackOptions.initMode}
          readOnly={sandpackOptions.readOnly}
          showInlineErrors={sandpackOptions.showInlineErrors}
          showLineNumbers={sandpackOptions.showLineNumbers}
          showReadOnly={sandpackOptions.showReadOnly}
          showTabs={sandpackOptions.showTabs}
          wrapContent={sandpackOptions.wrapContent}
        />
        <SandpackPreview
          showNavigator={sandpackOptions.showNavigator ?? true}
          showOpenInCodeSandbox={showOpenInCodeSandbox}
          showRefreshButton={sandpackOptions.showRefreshButton}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
}
