# Speak-Notes

A voice-note taking app using the JavaScript Web Speech API; the app transcribes recognised speech into text and shows the result in a preview format and a note format, with real-time edit - the highlight of the app. The preview shows the transcribed speech simultaneously as speech is being recognised, and the note form displays recognised speech which sound complete, as in a complete sentence. There are sounds played when the speech recognition service is started and stopped, as a cue to users. The app listens in the language provided by the user agent. It allows to download the transcript, which is split into a new line at every period, as a text file.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Notes

- MS Edge seems to give faster results - the results it gives syncs well with the recognised speech.
- Brave browser supports it, apparently, but always shows a network error. [Here's a link that describes the issue](https://stackoverflow.com/questions/74113965/speechrecognition-emitting-network-error-event-in-brave-browser)
- Firefox lacks support for the API, currently.
- Some browsers use a server-based recognition engine. The audio is sent to a web service for recognition processing, so it works online only - major reason Brave gives an error.

## Usage

Give credits if you'll be using.

## Contribution

It's a very interesting API, I would love to see any feature requests.

Feature you could contribute:

1. let's users choose the language they want to record in.
2. Anything that's interesting enough.

## Start the App

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
