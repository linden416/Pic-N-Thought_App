import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  GridColumn,
  MenuHeader
} from 'semantic-ui-react'

import { addPicNThought, deletePicNThought, getPicNThoughts, patchPicNThought } from '../api/PnT-api'
import Auth from '../auth/Auth'
import { PicNThought } from '../types/PicNThought'

interface PnTProperties {
  auth: Auth
  history: History
}

//interface PnTState {
//  todos: Todo[]
//  newPnT: string
//  loadingPnTs: boolean
//}
interface PnTState {
  pntz: PicNThought[]
  newPnT: string
  loadingPnTs: boolean
  pntMood: any
}

export class PnTs extends React.PureComponent<PnTProperties, PnTState> {
  state: PnTState = {
    pntz: [],
    newPnT: '',
    loadingPnTs: true,
    pntMood: null
  }

  onAddButtonClick = () => {
    this.props.history.push(`/pnts/add`)
  }

  onEditButtonClick = (pntId: string, thought: string, mood: string, createdDt: string) => {
    let comboFields = pntId + ";" + thought + ";" + mood + ";" + createdDt
    this.props.history.push(`/pnts/${comboFields}/edit`)
  }

  onTodoDelete = async (pntId: string) => {
    try {
      await deletePicNThought(this.props.auth.getIdToken(), pntId)
      this.setState({
        pntz: this.state.pntz.filter(pnt => pnt.pntId != pntId)
      })
    } catch {
      alert('Pic-N-Thought deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const pntz = await getPicNThoughts(this.props.auth.getIdToken())
      this.setState({pntz, loadingPnTs: false })
    } catch (e) {
      alert(`Failed to fetch Pic-N-Thoughts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Pic-N-Thought</Header>

        {this.renderCreateTodoInput()}

        {this.renderPicNThoughts()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={3}>
          <Input action={{
            color: 'olive',
            labelPosition: 'left',
            icon: 'add',
            content: 'Add New Pic-N-Thought',
            onClick: this.onAddButtonClick
          }}
          actionPosition='left'
          placeholder='Click to post'/>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPicNThoughts() {
    if (this.state.loadingPnTs) {
      return this.renderLoading()
    }

    return this.renderPnTsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Pic-N-Thoughts
        </Loader>
      </Grid.Row>
    )
  }

  renderPnTsList() {
    const booyah: any = 'meh outline'
     return (
      <Grid padded>
        {this.state.pntz.map((pnt, pos) => {
          return (
            <Grid.Row key={pnt.pntId}>

              <Grid.Column width={10} verticalAlign="middle">
              </Grid.Column>
              <Grid.Column width={3} floated="right">
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(pnt.pntId,pnt.thought,pnt.mood,pnt.createdDt)}>
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(pnt.pntId)}>
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              
              {pnt.attachmentUrl && (
                <Image src={pnt.attachmentUrl} size="large" rounded floated='left' />
                
              )}
    
              <Grid.Column width={8} floated="left">
                <p>{pnt.createdDt}</p>
                <p><Icon name={pnt.mood} color="yellow" size="big"  /></p>
                <p>{pnt.thought}</p>
              </Grid.Column>

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>

            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    return dateFormat(date, 'mm-dd-yyyy hh:mm') as string
  }
}
