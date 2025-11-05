import '@mantine/core/styles.css';
import './App.scss'
import { Container } from '@mantine/core'
import UserList from './UserList'

function App() {
  return (
    <Container size="md" mt="xl">
      <UserList />
    </Container>
  )
}

export default App
