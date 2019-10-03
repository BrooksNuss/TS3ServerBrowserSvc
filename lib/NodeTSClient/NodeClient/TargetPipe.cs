using System;
using System.Threading;
using TS3Client;
using TS3Client.Audio;
using TS3Client.Full;

namespace NodeClient {
	internal class TargetPipe: IAudioActiveProducer, IAudioPassiveConsumer {
		public bool Active { get { return true; } }
		public IAudioPassiveConsumer OutStream { get; set; }
		//public IAudioPassiveProducer InStream { get; set; }
		//private bool running = false;
		//public TimeSpan sendCheckInterval = TimeSpan.FromMilliseconds(5);
		//private byte[] readBuffer = Array.Empty<byte>();
		//public int ReadBufferSize { get; set; } = 960;
		//private Thread tickThread;

		public TargetPipe(IAudioPassiveConsumer outStream) {
			//this.InStream = inStream;
			this.OutStream = outStream;
			//Initialize();
		}

		//private void ReadLoop() {
		//	while (running) {
		//		ReadTick();
		//		Thread.Sleep(sendCheckInterval);
		//	}
		//}

		//private void ReadTick() {
		//	var inStream = InStream;
		//	if (inStream is null)
		//		return;

		//	if (readBuffer.Length < ReadBufferSize)
		//		readBuffer = new byte[ReadBufferSize];

		//	int read = inStream.Read(readBuffer, 0, readBuffer.Length, out Meta meta);
		//	if (read == 0) {
		//		return;
		//	}

		//	if (meta is null) {
		//		meta = new Meta();
		//		meta.Codec = Codec.OpusVoice;
		//		meta.Out = new MetaOut();
		//		meta.Out.SendMode = TargetSendMode.Voice;
		//	}

		//	Write(new Span<byte>(readBuffer, 0, read), meta);
		//}

		public void Write(Span<byte> data, Meta meta) {
			OutStream.Write(data, meta);
		}

		//public void Initialize() {
		//	if (running)
		//		return;

		//	running = true;
		//	tickThread = new Thread(ReadLoop);
		//	tickThread.Start();
		//}
	}
}
