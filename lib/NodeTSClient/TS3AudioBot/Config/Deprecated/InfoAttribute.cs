// TS3AudioBot - An advanced Musicbot for Teamspeak 3
// Copyright (C) 2017  TS3AudioBot contributors
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the Open Software License v. 3.0
//
// You should have received a copy of the Open Software License along with this
// program. If not, see <https://opensource.org/licenses/OSL-3.0>.

namespace TS3AudioBot.Config.Deprecated
{
	using System;

	[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
	internal sealed class InfoAttribute : Attribute
	{
		public bool HasDefault => DefaultValue != null;
		public string Description { get; }
		public string DefaultValue { get; }

		public InfoAttribute(string description)
		{
			Description = description;
			DefaultValue = null;
		}

		public InfoAttribute(string description, string defaultValue)
		{
			Description = description;
			DefaultValue = defaultValue;
		}
	}
}
