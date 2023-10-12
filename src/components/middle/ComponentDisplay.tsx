import { List, ListItem, ListItemText, Divider } from '@mui/material';
import DeleteBtn from './DeleteBtn';

interface ComponentDisplayProps {
  components: string[];
}

function ComponentDisplay({ components }: ComponentDisplayProps) {
  return (
    <List>
      {components.map((component, index) => (
        <>
          <ListItem divider sx={{ width: 1 / 4 }}>
            <ListItemText primary={component} />
            <DeleteBtn id={index} />
          </ListItem>
          <Divider sx={{ width: 1 / 4 }} />
        </>
      ))}
    </List>
  );
}

export default ComponentDisplay;
