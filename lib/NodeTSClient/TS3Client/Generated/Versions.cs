// TS3Client - A free TeamSpeak3 client implementation
// Copyright (C) 2017  TS3Client contributors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the Open Software License v. 3.0
//
// You should have received a copy of the Open Software License along with this
// program. If not, see <https://opensource.org/licenses/OSL-3.0>.
// <auto-generated />











namespace TS3Client.Full
{
	using System;

	/// <summary>
	/// Describes a triple of version, platform and a cryptographical signature (usually distributed by "TeamSpeak Systems").
	/// Each triple has to match and is not interchangeable with other triple parts.
	/// </summary>
	public sealed class VersionSign
	{
		private static readonly string[] Platforms = { null, "Windows", "Linux", "OS X", "Android", "iOS" };

		public string Sign { get; }
		public string Name { get; }
		public ClientPlatform Platform { get; }
		public string PlatformName { get; }

		public VersionSign(string name, ClientPlatform platform, string sign)
		{
			if (platform == ClientPlatform.Other)
				throw new ArgumentException(nameof(platform));
			Name = name;
			Sign = sign;
			Platform = platform;
			PlatformName = Platforms[(int)platform];
		}

		public VersionSign(string name, string platform, string sign)
		{
			Name = name;
			Sign = sign;
			Platform = ClientPlatform.Other;
			PlatformName = platform;
		}

		public bool CheckValid() => Ts3Crypt.EdCheck(this);

		// ReSharper disable InconsistentNaming, UnusedMember.Global
		public static VersionSign VER_WIN_3_X_X { get; } = new VersionSign("3.?.? [Build: 5680278000]", ClientPlatform.Windows, "DX5NIYLvfJEUjuIbCidnoeozxIDRRkpq3I9vVMBmE9L2qnekOoBzSenkzsg2lC9CMv8K5hkEzhr2TYUYSwUXCg==");
		public static VersionSign VER_IOS_3_X_X { get; } = new VersionSign("3.?.? [Build: 5680278000]", ClientPlatform.Ios, "XrAf+Buq6Eb0ehEW/niFp06YX+nGGOS0Ke4MoUBzn+cX9q6G5C0A/d5XtgcNMe8r9jJgV/adIYVpsGS3pVlSAA==");
		public static VersionSign VER_AND_3_X_X { get; } = new VersionSign("3.?.? [Build: 5680278000]", ClientPlatform.Android, "AWb948BY32Z7bpIyoAlQguSmxOGcmjESPceQe1DpW5IZ4+AW1KfTk2VUIYNfUPsxReDJMCtlhVKslzhR2lf0AA==");
		public static VersionSign VER_IOS_3_2_3 { get; } = new VersionSign("3.2.3 [Build: 1538494750]", ClientPlatform.Ios, "YgRxbZGpaxVAPuC3bln8HiCdgyx8EgM37H+VCSjZnn+05+lo1w74P9LFHSVqr1NBuB5YtKNWp0xjHRbBZVJtDQ==");
		public static VersionSign VER_WIN_3_2_3 { get; } = new VersionSign("3.2.3 [Build: 1538467030]", ClientPlatform.Windows, "dZ1i/CsCaAh4F7Pi2F/FfaBpdTmUuNVsAIRnqm86FUR3HhwBRn+xlmbwRF8gObgFMuwFMCLmawncFWplSILKAQ==");
		public static VersionSign VER_LIN_3_2_3 { get; } = new VersionSign("3.2.3 [Build: 1538467030]", ClientPlatform.Linux, "pEBdtUvRUmczMmHZM5xmeZuiRP/Kb/H2YShNKGpaat8aPTmG5EF+zsbjUFNWW4tnt43Yard0bWDUsrJ9/mmjBQ==");
		public static VersionSign VER_WIN_3_2_2 { get; } = new VersionSign("3.2.2 [Build: 1537178465]", ClientPlatform.Windows, "LHJV3O+hoZZlKWDPKH4ZMCoPUarYWwnaUgfMP+Xdm/4sY5NYUYjkVQaU4FS4pqxii5jx6O4cFToG7ekFB53NBA==");
		public static VersionSign VER_OSX_3_2_2 { get; } = new VersionSign("3.2.2 [Build: 1537178465]", ClientPlatform.Osx, "QbSOeAPhPHgZKykNbEAlzGLZe8w+ulxcZXbk07wOBGLK/vWCfQlyIDPUK5DipGBUfRY9yJvxfUx7g9b5dU8aBw==");
		public static VersionSign VER_LIN_3_2_2 { get; } = new VersionSign("3.2.2 [Build: 1537178465]", ClientPlatform.Linux, "P2NaVyWrk5AkG1KE8hTPCT6J0ql0NzLeeII4BF3WarfVjDbekqKu2sQfO7W3OSJKN3cH8w5470csP4LZ+hrkAA==");
		public static VersionSign VER_IOS_3_2_2 { get; } = new VersionSign("3.2.2 [Build: 1536587534]", ClientPlatform.Ios, "4rsRo3H9Uw0kui/cQkaBiqYy8ox6/gC6jDUVktcB6I71m1TeqUYy/IYMYbNSBtv0bmKntvcA0ZU79+zoXUkSAg==");
		public static VersionSign VER_IOS_3_2_0 { get; } = new VersionSign("3.2.0 [Build: 1534410132]", ClientPlatform.Ios, "BIWgZdgGSu6yPwCiEDQuORaLRqV1Z17ZLcxYdLqM2hfWXiKwBOO/j5eH4IH7LGubFfDwdGcVW2RUYKATpaJAAA==");
		public static VersionSign VER_WIN_3_2_1 { get; } = new VersionSign("3.2.1 [Build: 1534255236]", ClientPlatform.Windows, "RtNOb2UrlXwwy3lplxRilvknygxamwb3eKlRRAsG5YjrMEikStl/Sf+oJgFUFBBMSJ+q+xPx3+xfOmMxAkB8Bg==");
		public static VersionSign VER_OSX_3_2_1 { get; } = new VersionSign("3.2.1 [Build: 1534255236]", ClientPlatform.Osx, "AWbZhd8XH+s7uu5Qkb2QkdDcc9/WXfNu2iKWD+e6m2oTrOmI1Jt55SsyDTvkpBpumnWsrtR/GI2nK9HbmFhGAw==");
		public static VersionSign VER_LIN_3_2_1 { get; } = new VersionSign("3.2.1 [Build: 1534255236]", ClientPlatform.Linux, "betw82OYRNjyhXDHmmUKwR6xfvyPHBMdkn+jukQKNG8PPLKOfLFb0OAMXPZxp9n8gio840gFowwA/jnbg/OMBw==");
		public static VersionSign VER_WIN_3_2_0 { get; } = new VersionSign("3.2.0 [Build: 1533739581]", ClientPlatform.Windows, "TJ1XoCjQz+VxW15qiGInWf5llTBtVu+2m2ShbY0/HWTM7adLyfThq7wzSgr09Fvowibvu91nOFxTlIpPXCAVAQ==");
		public static VersionSign VER_OSX_3_2_0 { get; } = new VersionSign("3.2.0 [Build: 1533739581]", ClientPlatform.Osx, "WkySbYMiHN22ra3Y1cktHyeNikQ4fZ0K++8brc+8ImYhuzrmuzeGwL+QNaPJNty7stTNCfRUSpDzVAWz5TYQCA==");
		public static VersionSign VER_LIN_3_2_0 { get; } = new VersionSign("3.2.0 [Build: 1533739581]", ClientPlatform.Linux, "Vt+iPp952TU4uKwGXY0L61mXgBNfXg+1+16fnS0snPU9fhkfOKzdPN4rBELOwJ5XzZc33KdVC8rzZGYzlQceBg==");
		public static VersionSign VER_WIN_3_1_10 { get; } = new VersionSign("3.1.10 [Build: 1528537615]", ClientPlatform.Windows, "+/BWvueikGg4YkO1v2uuZB5vtJJgUZ5bL8cRfxAstfnCVdro2ja+4a+8rGUzDx8/vvTZOUVD6U95hnWb638MCQ==");
		public static VersionSign VER_OSX_3_1_10 { get; } = new VersionSign("3.1.10 [Build: 1528537615]", ClientPlatform.Osx, "AJMF6gyw5DBtzAuW7aA7YcZaLIgOHFappwzWtE+0UUMYgMjMkSZ1LewDaW3YyRDHuLG5Nb7X26VNhFNZu+ohBw==");
		public static VersionSign VER_LIN_3_1_10 { get; } = new VersionSign("3.1.10 [Build: 1528537615]", ClientPlatform.Linux, "jEfjYy09JfbJPZ+W3fwqygOu8uuc5raYTGpbJ5F8dHLHpqUfvmCyJVKoXRieMNkmPzeiylsUc9/HiV+8bt8tDw==");
		public static VersionSign VER_WIN_3_1_9 { get; } = new VersionSign("3.1.9 [Build: 1525442084]", ClientPlatform.Windows, "2SLjPTFXM9hQyNkeEGYIzs0fkBffyhsh5z+ZuaCcZdDfM8vgRM5lrAU6KNspFjLddcvw8cXw6gxRY73ZHsRVBg==");
		public static VersionSign VER_OSX_3_1_9 { get; } = new VersionSign("3.1.9 [Build: 1525442084]", ClientPlatform.Osx, "WVaMmYPig4eG2JUM8cMMW2MA7+IoRoPUSr74CPe7oS8TLHGjYxPr1FP88op6YsFFQrPJysWmIsnGR7BiFXjHCQ==");
		public static VersionSign VER_LIN_3_1_9 { get; } = new VersionSign("3.1.9 [Build: 1525442084]", ClientPlatform.Linux, "wBcnfNU7FA0CvFeisKhywZWzmUqD6IBFbYQTveMvxWowXUjWwNHTg9tbRLQ1YgBFDdlOwV36VMX7aAMXMX2rAA==");
		public static VersionSign VER_IOS_3_1_8 { get; } = new VersionSign("3.1.8 [Build: 1516887927]", ClientPlatform.Ios, "pdWyIOpTWECIdA2NExrjqY1a7Q0alFyU7MgiDJYdiUXAspusOHwMIcfKm7oAh+Ty2gcgVgOh8wAPyZcKFKYXBA==");
		public static VersionSign VER_AND_3_1_8 { get; } = new VersionSign("3.1.8 [Build: 1516865456]", ClientPlatform.Android, "sG/qsKb9iZpBRXFSYY2Tuq7ZLUKHcmgA/6Qe/cx35L3risqoH4aGkPkDicuKtaQi8Ikh4IrQz6xe7V49M+8VBg==");
		public static VersionSign VER_WIN_3_1_8 { get; } = new VersionSign("3.1.8 [Build: 1516614607]", ClientPlatform.Windows, "gDEgQf/BiOQZdAheKccM1XWcMUj2OUQqt75oFuvF2c0MQMXyv88cZQdUuckKbcBRp7RpmLInto4PIgd7mPO7BQ==");
		public static VersionSign VER_OSX_3_1_8 { get; } = new VersionSign("3.1.8 [Build: 1516614607]", ClientPlatform.Osx, "93J+FDUbtRjonzFnQpGdgN6+o4jwI2M65zEKftQILCdZlGHGfc7z5Z9+TM6nU0/pnPgTqvKmaw9WYPsh88iCCA==");
		public static VersionSign VER_LIN_3_1_8 { get; } = new VersionSign("3.1.8 [Build: 1516614607]", ClientPlatform.Linux, "LJ5q+KWT4KwBX7oR/9j9A12hBrq5ds5ony99f9kepNmqFskhT7gfB51bAJNgAMOzXVCeaItNmc10F2wUNktqCw==");
		public static VersionSign VER_WIN_3_1_7 { get; } = new VersionSign("3.1.7 [Build: 1513163251]", ClientPlatform.Windows, "tdNngCAZ1ImAf7BxJzO4RXv5nBRsUERsrSOnMKVUFNQg6BS4Bzag0RFgLVzs2DRj19AC8+q5cXgH+5Ms50mTCA==");
		public static VersionSign VER_LIN_3_1_7 { get; } = new VersionSign("3.1.7 [Build: 1513163251]", ClientPlatform.Linux, "/j5TZqPuOU8yMYPdGehvijYvU74KefRrKO5sgTUrkpeslNFiy4XfU7quKW0diLHQoPQn1t3KArdfzOAMk8dlAg==");
		public static VersionSign VER_OSX_3_1_7 { get; } = new VersionSign("3.1.7 [Build: 1512141423]", ClientPlatform.Osx, "PP+/cBUDtSyV0k7lm8aYvYWAs28KL+KmXa+f0pUpDqjQDKy8dnDzJp16F4YGJxJ+2ODGPkp5YQYwts3m8T7+CA==");
		public static VersionSign VER_WIN_3_1_6 { get; } = new VersionSign("3.1.6 [Build: 1502873983]", ClientPlatform.Windows, "73fB82Jt1lmIRHKBFaE8h1JKPGFbnt6/yrXOHwTS93Oo7Adx1usY5TzNg+8BKy9nmmA2FEBnRmz5cRfXDghnBA==");
		public static VersionSign VER_LIN_3_1_6 { get; } = new VersionSign("3.1.6 [Build: 1502873983]", ClientPlatform.Linux, "o+l92HKfiUF+THx2rBsuNjj/S1QpxG1fd5o3Q7qtWxkviR3LI3JeWyc26eTmoQoMTgI3jjHV7dCwHsK1BVu6Aw==");
		public static VersionSign VER_WIN_3_1_5 { get; } = new VersionSign("3.1.5 [Build: 1500537355]", ClientPlatform.Windows, "O9WqHB9oX0qe9AXIYmJm0+mzl6VLxNvrGF0lGlovLaig5MXUIwd6T00NkCj62OkBbzM3eECs9FUuJk7N8V0dCg==");
		public static VersionSign VER_LIN_3_1_5 { get; } = new VersionSign("3.1.5 [Build: 1500537355]", ClientPlatform.Linux, "Ea/9gUeh5HuXyiOZ+gRDPOn0rDHzXDVSYB70qy/BtczJPZn/0dDwQgRAF7/W6vHcaH67j+IF9AtUpuDCA6yzBw==");
		public static VersionSign VER_WIN_3_1_4_2 { get; } = new VersionSign("3.1.4.2 [Build: 1498644101]", ClientPlatform.Windows, "WtscrpvJG13kbF6aoVzsGwQuE/WwR1b8++ydDc8IpmiXLw+zFC6zFUvLinOeE0zZgh2Hs5Amp3DZoPJSynOWBg==");
		public static VersionSign VER_LIN_3_1_4_2 { get; } = new VersionSign("3.1.4.2 [Build: 1498644101]", ClientPlatform.Linux, "Rv3SzHDwLIkuUqySQhn279jf2b7PPzCQH2q53zHWH5qyFL/Qw4m/n7ZrXEF46/sUSpOPFPYjfKMKcN/9IRCoCQ==");
		public static VersionSign VER_WIN_3_1_4 { get; } = new VersionSign("3.1.4 [Build: 1491993378]", ClientPlatform.Windows, "rwdyEwnJCzbVfNCqbxMrRyhL5BSYqYSzKQkeZ6m5KImc1F8VB8wEkwwwyxoG7SimC/sxIyy4h27CjBFP6rcgBQ==");
		public static VersionSign VER_LIN_3_1_4 { get; } = new VersionSign("3.1.4 [Build: 1491993378]", ClientPlatform.Linux, "wJPx0S2Q2S8EgSEpZhu+Yp80d6xVQDX5u9DYgm7XxI7sh7gJIoBbdaE5cfjwR2UN6XFyV+V/2AV4stB3CxtgCQ==");
		public static VersionSign VER_WIN_3_1_3 { get; } = new VersionSign("3.1.3 [Build: 1490279472]", ClientPlatform.Windows, "7RPY2bzJmMdgVX24VuKD3lTnYYb6yHWqfn2x21tFOjXL9q+2t7tU9Vy8Bh5/IpeiqklUHTWc23mWpYOCoW9eCA==");
		public static VersionSign VER_LIN_3_1_3 { get; } = new VersionSign("3.1.3 [Build: 1490279472]", ClientPlatform.Linux, "Y1M2TQvKLGmUSP4YPuTBQOeUxmF+jaqazFXuN4v2gOKP8QmxyYOsg9PsG9z7SFYQkgneQxs8QdzC+IGo0bOWBQ==");
		public static VersionSign VER_WIN_3_1_2 { get; } = new VersionSign("3.1.2 [Build: 1489662774]", ClientPlatform.Windows, "5Aaj21gGFtrjW9424ezfLa1SMQBpZvgQgcJLZmrLoNMe4XebBPV2s8rxEDAIodfFpruLxLFbFpH63A/BGnJyDw==");
		public static VersionSign VER_LIN_3_1_2 { get; } = new VersionSign("3.1.2 [Build: 1489662774]", ClientPlatform.Linux, "W9TgKEviDgWvrQErw8vaoQcPboaUx8xRL5MPoQzlur9eO2yseHgvzkpWGYqSQyCI+ptcCpTHaXRFym0imKnfBA==");
		public static VersionSign VER_WIN_3_1_1_1 { get; } = new VersionSign("3.1.1.1 [Build: 1487668590]", ClientPlatform.Windows, "CchjMitGiVGfRlGph0D1mDjOCJCnkVxR/WuYvNHdPyeQUCncRWML8jYxYfnhRF6CzViwYRnsmZkN+W5oenB2CQ==");
		public static VersionSign VER_LIN_3_1_1_1 { get; } = new VersionSign("3.1.1.1 [Build: 1487668590]", ClientPlatform.Linux, "0B4RK2WOu5w39+CLznQtaexYeNqqBwU9YHBvSLw3bu+OAne8XtFc2NJzepjynrxwc1/xsmrm8uEZJzqzF+TcAg==");
		public static VersionSign VER_WIN_3_1_1 { get; } = new VersionSign("3.1.1 [Build: 1486712038]", ClientPlatform.Windows, "sryyx++NhRWKDAo+Tnwv9N+IrOaQBP0XjjDszY0BBv0YIMr4jmdHtgrwzWkUqhU7kfql7qBWIhlb/r0l1ZHeBw==");
		public static VersionSign VER_LIN_3_1_1 { get; } = new VersionSign("3.1.1 [Build: 1486712038]", ClientPlatform.Linux, "umeERdZkG9pS3oeJTirnYK9Q947j8lVlszz2VXBPcjhQrsiKFM6lIkbj3K2HSqA/hJ+sUOcuZgo880PmU6ZdCw==");
		public static VersionSign VER_WIN_3_1_0_1 { get; } = new VersionSign("3.1.0.1 [Build: 1484223040]", ClientPlatform.Windows, "oaaorJ4co/sS2m5JT5oRiu9AieW6kfFY+RENqPfp26iP4pbWbf9GcZj+JhDA+/JyLpfueCcSulZSRRbash2JCw==");
		public static VersionSign VER_LIN_3_1_0_1 { get; } = new VersionSign("3.1.0.1 [Build: 1484223040]", ClientPlatform.Linux, "xWfxm14Vw53mTMHuzeaIM428KkoI/2wuoR4O2TIuy2Q7ZpwaN48vG0rMJbUQNVycP8rRHg+bIGuFiJai8f5dDg==");
		public static VersionSign VER_WIN_3_1 { get; } = new VersionSign("3.1 [Build: 1481795005]", ClientPlatform.Windows, "3TpZZM0V+PKHELFnsfRPoKjEFfvfHUL/6mUP5LHbI3nvmdOjRqEEKi4ndXZG6OpWOKQ3VeadHDH0KBfD8EI2Cg==");
		public static VersionSign VER_LIN_3_1 { get; } = new VersionSign("3.1 [Build: 1481795005]", ClientPlatform.Linux, "xpJQcdaIImbctnJw0PnLQOIZBcmN+HDGcjxoIW8So7SSdSYLyUI5lAECWaCewbYmNKqaO85YqXPiNXfOBM5fBA==");
		public static VersionSign VER_WIN_3_0_19_4 { get; } = new VersionSign("3.0.19.4 [Build: 1468491418]", ClientPlatform.Windows, "ldWL49uDKC3N9uxdgWRMTOzUuiG1nBqUiOa+Nal5HvdxJiN4fsTnmmPo5tvglN7WqoVoFfuuKuYq1LzodtEtCg==");
		public static VersionSign VER_OSX_3_0_19_4 { get; } = new VersionSign("3.0.19.4 [Build: 1468491418]", ClientPlatform.Osx, "Pvcizdk3HRQMzTLt7goUYBmmS5nbAS1g2E6HIypLU+9eXTqGTBLim0UUtKc0s867TFHbK91GroDrTtv0aMUGAw==");
		public static VersionSign VER_LIN_3_0_19_4 { get; } = new VersionSign("3.0.19.4 [Build: 1468491418]", ClientPlatform.Linux, "jvhhk75EV3nCGeewx4Y5zZmiZSN07q5ByKZ9Wlmg85aAbnw7c1jKq5/Iq0zY6dfGwCEwuKod0I5lQcVLf2NTCg==");
		public static VersionSign VER_WIN_3_0_19_3 { get; } = new VersionSign("3.0.19.3 [Build: 1466672534]", ClientPlatform.Windows, "a1OYzvM18mrmfUQBUgxYBxYz2DUU6y5k3/mEL6FurzU0y97Bd1FL7+PRpcHyPkg4R+kKAFZ1nhyzbgkGphDWDg==");
		public static VersionSign VER_WIN_3_0_19_2 { get; } = new VersionSign("3.0.19.2 [Build: 1466597785]", ClientPlatform.Windows, "sDOzu7rCGb7kBID2WbBk35DjPijKkXzujnsAtLhXxhkQ+am0JlDOpuU1ISHhq9gCl/Qo0dzc723o0AIPI+yoCQ==");
		public static VersionSign VER_WIN_3_0_20 { get; } = new VersionSign("3.0.20 [Build: 1465542546]", ClientPlatform.Windows, "vDK31sOwOvDpTXgqAJzmR1NzeUeSDG9dLMgIz5LCX+KpDSVD/qU60mzScz9tuc9AsLyrL8DxHpDDO3eQD+hYCA==");
		public static VersionSign VER_AND_3_0_23 { get; } = new VersionSign("3.0.23 [Build: 1463662487]", ClientPlatform.Android, "RN+cwFI+jSHJEhggucIuUyEteWNVFy4iw0QDp3qn2UzfopypFVE9BPZqJjBUGeoCN7Q/SfYL4RNIRzJEQaZUCA==");
		public static VersionSign VER_WIN_3_0_19_1 { get; } = new VersionSign("3.0.19.1 [Build: 1461588969]", ClientPlatform.Windows, "KYo52MA89dowkYpFU1KixgHngjbJ6F2Yi++5tbaqBlBpz9YikX2gI3sqmU1kP1ghsKCLKM7o0patDH1hv9bmAg==");
		public static VersionSign VER_WIN_3_0_19 { get; } = new VersionSign("3.0.19 [Build: 1459504131]", ClientPlatform.Windows, "JoHyZHF4k/a3+QH1zPNSEzc40487fzbpssyRZtoWB5kbQorAJgwlpcScA08J4vjGoUbdaTZsT0vCw56wo/Q9Ag==");
		public static VersionSign VER_WIN_3_0_18_2 { get; } = new VersionSign("3.0.18.2 [Build: 1445512488]", ClientPlatform.Windows, "F0hY25Dtja0wcU6dzC39rNuYbhnDAbIwPHC3VO9Oicf13kUY2I2g6scPZ3p195Cw9gUYdBIRYm8ucHEhtSeWCw==");
		public static VersionSign VER_WIN_3_0_18_1 { get; } = new VersionSign("3.0.18.1 [Build: 1444491275]", ClientPlatform.Windows, "xqfa3CUd2GFiTqjJWYzcu9ZbxVVLng8qIMKlVxMqWdiM8JrTRiXBAaTBDd8Xc+flVe+rGSIOZTkXRsz1rqjiAA==");
		public static VersionSign VER_WIN_3_0_18 { get; } = new VersionSign("3.0.18 [Build: 1442998335]", ClientPlatform.Windows, "vUgm8mJoeVLBG6qB2HcYF7YNG4D+H/4edILaZbHze2Unua6mrBvNmbtRkRtmRyDZSd7sVQHMApinRDgGT1mUBw==");
		public static VersionSign VER_WIN_3_0_17 { get; } = new VersionSign("3.0.17 [Build: 1438673913]", ClientPlatform.Windows, "znDjHvCgmQF/jQKTK49X8tnXqF7AGXfS2XYcogww4XxNTBxp2tf1aFc/jgboKco9EuVa0ku2cf/xg9wW3Cm7AQ==");
		public static VersionSign VER_WIN_3_0_16 { get; } = new VersionSign("3.0.16 [Build: 1407159763]", ClientPlatform.Windows, "Y1DuQGXo/8/rYznEGyeQHgpvZMuiCH4FYm4QVyAgLYyMpNpc/LM7XetVWhDQxGsNejkN/2olI7GVJkt4X+ooDg==");
		public static VersionSign VER_LIN_3_0_16 { get; } = new VersionSign("3.0.16 [Build: 1407159763]", ClientPlatform.Linux, "8776GitHAgkFPfOLxEh5x+Luuh4NrYPEJUdsUzNKndcAuWMYjwQTZkmeZOeG/swdn/p2Cg2pRfZfsIFSOAUWCQ==");
		public static VersionSign VER_WIN_3_0_15_1 { get; } = new VersionSign("3.0.15.1 [Build: 1405341092]", ClientPlatform.Windows, "b+hr0KQWOVW2WEn49BmNb08R9zimsJcThm2gEeF7EAgRUeUDYzeplh5HrHmda0ftbbnrzWV33U/GOo2LAs/rAg==");
		public static VersionSign VER_WIN_3_0_15 { get; } = new VersionSign("3.0.15 [Build: 1403250090]", ClientPlatform.Windows, "FKKAHPwV1swKwH6mqHqdcGuYm8o5mZw4WreBxJrQjOprC3NXXcJviPe0p7EZPI810HOWMfmQRUgFpggoRL8kAQ==");
		public static VersionSign VER_WIN_3_0_14 { get; } = new VersionSign("3.0.14 [Build: 1394624943]", ClientPlatform.Windows, "F0WIO9sBVzG893AtX2Jfd98cH6yZPAnfMBNvBlQbAIfvfyiq+cbjZ31AUngEjq7UPIYdnYSsdRX9hczwdBrKAQ==");
		public static VersionSign VER_WIN_3_0_13_1 { get; } = new VersionSign("3.0.13.1 [Build: 1382530211]", ClientPlatform.Windows, "bCIfLPUgTM6C0kNkesvhcxaDPvV9h6qLbYVy9cQVSP5lzaYebZaeDzAOOHsdjKcRTa6LU1oHEdz9D/d+2gxJCw==");
		public static VersionSign VER_WIN_3_0_13 { get; } = new VersionSign("3.0.13 [Build: 1380283653]", ClientPlatform.Windows, "7dA+6EbVyMevol4gE3/Cu1WonRjqu1C6pTWF+txApbaiTgKtZ/ky+NVxluPkSDnCxXN1pOR4uGdF6B7LUqQgDQ==");
		public static VersionSign VER_WIN_3_0_12 { get; } = new VersionSign("3.0.12 [Build: 1378715177]", ClientPlatform.Windows, "x6wFA5xqjenf6kbAh36IC4CkrbT8/uSBpgjM9juSt9oxGCXLqHOC2oaYlB1zZSJZjT4sOrnp0M+uOdVjYCzLCg==");
		public static VersionSign VER_WIN_3_0_11_1 { get; } = new VersionSign("3.0.11.1 [Build: 1375773286]", ClientPlatform.Windows, "Qfvcn4uQmKETDsD4LbtdbZR8rDetJ26Z/bVbu5SZJjMjGlYEMSbJnR4PtOBshdMSEwEsAJf1G+5tjx+onm2fDA==");
		public static VersionSign VER_WIN_3_0_11 { get; } = new VersionSign("3.0.11 [Build: 1375083581]", ClientPlatform.Windows, "54wPDkfv0kT56UE0lv/LFkFJObH+Q4Irmo4Brfz1EcvjVhj8hJ+RCHcVTZsdKU2XvVvh+VLJpURulEHsAOsyBw==");
		// ReSharper restore InconsistentNaming, UnusedMember.Global
	}

	public enum ClientPlatform
	{
		Other = 0,
		Windows,
		Linux,
		Osx,
		Android,
		Ios,
	}
}
