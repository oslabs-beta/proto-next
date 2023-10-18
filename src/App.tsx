import React, { Dispatch, SetStateAction, useState } from 'react';
import { Box, Grid } from '@mui/material';
import TagsContainer from './components/middle/TagsContainer';
import './App.css';
import CreateComponentBtn from './components/middle/CreateComponentBtn';
import CodePreview from './components/right/CodePreview';
import explorer from './components/left/data/folderData';
import Folder from './components/left/folder';
import useTraverseTree from './components/left/hooks/use-traverse-tree';

interface ComponentNameType {
  componentName: string;
  setComponentName: Dispatch<SetStateAction<string>>;
}

export const CodeContext = React.createContext<ComponentNameType | undefined>(
  undefined
);

const App = () => {
  const [explorerData, setExplorerData] = useState(explorer);
  const [componentName, setComponentName] = useState<string>('App');

  const { insertNode, deleteNode } = useTraverseTree();

  const handleInsertNode = (
    folderId: number,
    item: string,
    isFolder: boolean
  ) => {
    const finalTree: any = insertNode(explorerData, folderId, item, isFolder);

    setExplorerData(finalTree);
  };

  const handleDeleteNode = (folderId: number) => {
    const finalTree: any = deleteNode(explorerData, folderId);
    setExplorerData(finalTree);
  };

  return (
    <CodeContext.Provider value={[componentName, setComponentName]}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          justifyContent={'space-between'}
          sx={{ border: 2, borderColor: 'pink', height: '100vh' }}
        >
          <Grid item xs={3.5} sx={{ border: 2, borderColor: 'red' }}>
            <Folder
              handleInsertNode={handleInsertNode}
              handleDeleteNode={handleDeleteNode}
              explorer={explorerData}
            />
          </Grid>

          <Grid
            item
            xs={4}
            sx={{ border: 2, borderColor: 'blue', display: 'flex' }}
          >
            <Grid alignSelf={'flex-start'}>
              <CreateComponentBtn />
            </Grid>
            <TagsContainer />
          </Grid>

          <Grid item xs={4} sx={{ border: 2, borderColor: 'green' }}>
            <CodePreview />
          </Grid>
        </Grid>
      </Box>
    </CodeContext.Provider>
  );
};

export default App;
