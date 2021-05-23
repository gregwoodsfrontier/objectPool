import Phaser from 'phaser'

import CratePool, { KEY_CRATE } from './cratePool'

const INFO_FORMAT = 
`Size:       %1
Spawned:    %2
Despawned:  %3`

export default class CratesScene extends Phaser.Scene
{
	private group?: CratePool
	private infoText?: Phaser.GameObjects.Text

	constructor()
	{
        const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
            classType: Phaser.GameObjects.Image,
            maxSize: -1
        }
		super('crates-scene-basic')
        
	}

	preload()
	{
		this.load.image(KEY_CRATE, 'assets/crate_01.png')
	}

	create()
	{
        this.matter.world.setBounds(0, -100, this.scale.width, this.scale.height + 100)
		
		this.group = this.add.cratePool()

		this.infoText = this.add.text(16, 16, '')
		this.infoText.setDepth(1000)

        this.time.addEvent({
			delay: 500,
			loop: true,
			callback: () => {
				this.spawnCrate()
			}
		})
	}

	update()
	{
		if (!this.group || !this.infoText)
		{
			return
		}

		const size = this.group.getLength()
		const used = this.group.getTotalUsed()
		const text = Phaser.Utils.String.Format(
			INFO_FORMAT,
			[
				size,
				used,
				size - used
			]
		)

		this.infoText.setText(text)
	}

	private spawnCrate()
	{
        if (!this.group)
		{
			return
		}

		if (this.group.countActive(true) >= 10)
		{
			return
		}

		const tex = this.textures.get(KEY_CRATE)
		const halfWidth = tex.getSourceImage().width * 0.5
		const x = Phaser.Math.Between(halfWidth, this.scale.width - halfWidth)

		const crate = this.group.spawn(x, 0)

		if (!crate)
		{
			return
		}

		crate.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, pointer => {
				this.group!.despawn(crate)
			})

		return crate
    }
}