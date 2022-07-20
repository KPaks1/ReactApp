CREATE TABLE [dbo].[Activities]
(
	[Key] NVARCHAR(50) PRIMARY KEY NOT NULL,
	[Activity] nvarchar(255) NOT NULL,
	[Accessibility] DECIMAL NULL,
	[Type] NVARCHAR(50) NULL,
	[Price] DECIMAL NULL,
	[Link] NVARCHAR(100) NULL,
	[UserId] NVARCHAR(450) FOREIGN KEY REFERENCES dbo.aspnetusers(Id) NOT NULL
)
