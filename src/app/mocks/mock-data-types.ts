import { Displayable } from '../model/displayable';

export const MOCK_DATA_TYPES: Displayable[] = [
  {
    id: 'heroes',
    description: 'Heroes',
    columns: [ 'id', 'name', 'alias' ]
  },
  {
    id: 'cases',
    description: 'Open Cases',
    columns: [ 'id', 'description', 'severity', 'callTakenBy', 'status']
  },
];
