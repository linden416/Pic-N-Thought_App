import * as React from 'react'
import { Form, Button, Label, Icon } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, addPicNThought } from '../api/PnT-api'
import dateFormat from 'dateformat'

enum UploadState {
  CreatingPicNThought,
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface PnTProps {
  auth: Auth
}

interface PnTState {
  file: any
  uploadState: UploadState,
  newthought: string,
  mood: string,
  newpntid: string,
  statusIcon: any,
  statusMsg: string,
  statusColor: any
}

export class AddPicNThought extends React.PureComponent<PnTProps, PnTState> {
  state: PnTState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    newthought: '',
    mood: '',
    newpntid: '',
    statusIcon: 'caret right',
    statusMsg: 'Please select a picture file, add text about it, and select a mood for it.',
    statusColor: 'black'
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleThought = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({newthought: event.target.value})
  }
  handleMood = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({mood: event.target.value})
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        this.setState({
          statusIcon: 'exclamation', 
          statusColor: 'red', 
          statusMsg: 'A picture needs to be selected'
         })
        return
      }
      if (!this.state.newthought) {
        this.setState({
          statusIcon: 'exclamation', 
          statusColor: 'red', 
          statusMsg: 'Enter a Thought about the picture'
         })
        return
      }
      if (!this.state.mood) {
        this.setState({
          statusIcon: 'exclamation', 
          statusColor: 'red', 
          statusMsg: 'Enter a Mood for how you feel'
         })
        return
      }
      
      this.setUploadState(UploadState.CreatingPicNThought)
      const newPnT = await addPicNThought(this.props.auth.getIdToken(), {
        thought: this.state.newthought,
        mood: this.state.mood,
        createdDt: dateFormat(new Date()) as string
      })

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), newPnT.pntId)
 
      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)
 
      this.setState({
        statusIcon: 'checkmark box', 
        statusColor: 'blue', 
        statusMsg: 'successfully added new Pic-N-Thought'
      })
    } catch (e) {
      this.setState({
        statusIcon: 'exclamation', 
        statusColor: 'red', 
        statusMsg: e.message
      })
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
      <div>
        <h1>Add New Pic-N-Thought</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Picture</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          <Form.Field label='Enter a thought that describes picture' 
             control='textarea' 
             rows='3' 
             name='thought'
             onChange={this.handleThought}
             />

          <Form.Field label='Mood' control='select' onChange={this.handleMood}>
             <option value='noselection'> </option>
             <option value='smile'>Happy</option>
             <option value='meh'>Concerning</option>
             <option value='frown'>Frown</option>
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.CreatingPicNThought && <p>Creating Pic-N-Thought</p>}
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit" color="olive">
          Submit
        </Button>
        <Label size='large'>
          <Icon name={this.state.statusIcon} color={this.state.statusColor} size="big"  />{this.state.statusMsg} 
        </Label>
      </div>
    )
  }
}
