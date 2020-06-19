import * as React from 'react'
import { Form, Button, Icon, Label } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, getPicNThought, patchPicNThought } from '../api/PnT-api'

enum UploadState {
  UpdatingPicNThought,
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
  PageHasBeenAltered,
  NoChanges
}

interface EditPnTProps {
  match: {
    params: {
      pntId: string
    }
  }
  auth: Auth
}

interface EditPnTState {
  file: any
  uploadState: UploadState
  pntId: string
  thought: string
  mood: string
  createdDt: string
  pageChangedState: UploadState
  statusIcon: any
  statusMsg: string
  statusColor: any
}

export class EditPicNThought extends React.PureComponent<EditPnTProps, EditPnTState> {
  state: EditPnTState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    pntId: '',
    thought: '',
    mood: '',
    createdDt: '',
    pageChangedState: UploadState.NoChanges,
    statusIcon: 'caret right',
    statusMsg: 'Select either a replacement picture, updated text, a mood for it, or change them all',
    statusColor: 'black'
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0],
      pageChangedState: UploadState.PageHasBeenAltered
    })
  }
  handleThought = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      thought: event.target.value,
      pageChangedState: UploadState.PageHasBeenAltered
    })
  }
  handleMood = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      mood: event.target.value,
      pageChangedState: UploadState.PageHasBeenAltered
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      /*
      if (!this.state.file) {
        alert('A Picture needs to be selected')
        return
      }
      if (!this.state.thought) {
        alert('Enter a Thought about the picture')
        return
      }
      if (!this.state.mood) {
        alert('Enter a Mood for how you feel')
        return
      }
      */
      if (!this.state.thought && !this.state.mood && !this.state.file)
      {
        this.setState({
          statusIcon: 'exclamation', 
          statusColor: 'red', 
          statusMsg: 'No edit was made'
         })
      }

      if (this.state.thought || this.state.mood) {
          this.setUploadState(UploadState.UpdatingPicNThought)
          const newPnT = await patchPicNThought(this.props.auth.getIdToken(), this.state.pntId, {
            thought: this.state.thought,
            mood: this.state.mood,
            createdDt: this.state.createdDt
          })
      }

      if (this.state.file) {
         this.setUploadState(UploadState.FetchingPresignedUrl)
         const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.state.pntId)
 
         this.setUploadState(UploadState.UploadingFile)
         await uploadFile(uploadUrl, this.state.file)
         alert('File was uploaded!')
      }
 
      this.setState({
        statusIcon: 'checkmark box', 
        statusColor: 'blue', 
        statusMsg: 'successfully updated new Pic-N-Thought'
      })

    } catch (e) {
      this.setState({
        statusIcon: 'exclamation', 
        statusColor: 'red', 
        statusMsg: 'Failed to edit Pic-N-Thought. ' + e.message
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
    if (this.state.pageChangedState != UploadState.PageHasBeenAltered){
      console.log(this.props.match.params.pntId)
      var comboFields = this.props.match.params.pntId.split(";")
      this.setState({
        pntId: comboFields[0], 
        thought: comboFields[1], 
        mood: comboFields[2], 
        createdDt: comboFields[3]
      })
    }

    return (
      <div>
        <h1>Edit Pic-N-Thought</h1>

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
             value={this.state.thought}
             onChange={this.handleThought}
             />

          <Form.Field label='Mood' control='select' value={this.state.mood}  onChange={this.handleMood}>
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